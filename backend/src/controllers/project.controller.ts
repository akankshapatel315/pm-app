import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../models';
import { computeCapStatus } from '../utils/capStatus';
import { getMonthRange } from '../utils/date';

async function getMonthlyHours(projectId: number, month?: string): Promise<number> {
  const { start, end } = getMonthRange(month);
  const total = await db.Entry.sum('hours', {
    where: { projectId, date: { [Op.between]: [start, end] } },
  });
  return total || 0;
}

export async function createProject(req: Request, res: Response) {
  const { name, clientName, monthlyHourCap, memberIds } = req.body;
  const user = req.user!;

  if (!name || !clientName) {
    return res.status(400).json({ message: 'name and clientName are required' });
  }

  if (monthlyHourCap !== undefined && monthlyHourCap !== null && typeof monthlyHourCap !== 'number') {
    return res.status(400).json({ message: 'monthlyHourCap must be a number' });
  }

  let memberIdList: number[] = [];
  if (memberIds !== undefined) {
    if (!Array.isArray(memberIds) || memberIds.some((memberId: unknown) => typeof memberId !== 'number')) {
      return res.status(400).json({ message: 'memberIds must be an array of numbers' });
    }
    memberIdList = [...new Set(memberIds)] as number[];

    if (memberIdList.length > 0) {
      const existingUsers = await db.User.findAll({ where: { id: memberIdList } });
      if (existingUsers.length !== memberIdList.length) {
        return res.status(400).json({ message: 'One or more memberIds do not exist' });
      }
    }
  }

  // Only a PM can reach this endpoint (see project.routes.ts), and a PM
  // always manages the projects they create. Reassigning a project to a
  // different manager afterward is an admin-only action (updateProjectManager).
  const project = await db.Project.create({
    name,
    clientName,
    monthlyHourCap: monthlyHourCap ?? null,
    createdBy: user.id,
    managerId: user.id,
  });

  if (memberIdList.length > 0) {
    await db.ProjectMember.bulkCreate(
      memberIdList.map((memberId) => ({ userId: memberId, projectId: project.id }))
    );
  }

  return res.status(201).json({ project });
}

export async function listProjects(req: Request, res: Response) {
  const { month } = req.query as { month?: string };
  const user = req.user!;

  let where: Record<string, unknown> = {};

  if (user.role === 'pm') {
    where = { [Op.or]: [{ createdBy: user.id }, { managerId: user.id }] };
  } else if (user.role === 'member') {
    const memberships = await db.ProjectMember.findAll({ where: { userId: user.id } });
    const projectIds = memberships.map((m: any) => m.projectId);
    where = { id: projectIds.length ? projectIds : -1 };
  }

  const projects = await db.Project.findAll({ where, order: [['createdAt', 'DESC']] });

  const withSummary = await Promise.all(
    projects.map(async (project: any) => {
      const hoursLogged = await getMonthlyHours(project.id, month);
      const { percentage, status } = computeCapStatus(hoursLogged, project.monthlyHourCap);

      return {
        id: project.id,
        name: project.name,
        clientName: project.clientName,
        monthlyHourCap: project.monthlyHourCap,
        createdBy: project.createdBy,
        managerId: project.managerId,
        hoursLogged,
        percentage,
        status,
      };
    })
  );

  return res.json({ projects: withSummary });
}

export async function getProject(req: Request, res: Response) {
  const { id } = req.params;
  const { month } = req.query as { month?: string };
  const user = req.user!;

  const project = await db.Project.findByPk(id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const isManagerOrCreator = project.createdBy === user.id || project.managerId === user.id;

  if (user.role === 'member') {
    const membership = await db.ProjectMember.findOne({
      where: { userId: user.id, projectId: id },
    });
    if (!membership) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } else if (user.role === 'pm' && !isManagerOrCreator) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const members = await db.ProjectMember.findAll({
    where: { projectId: id },
    include: [{ model: db.User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }],
  });

  const manager = project.managerId
    ? await db.User.findByPk(project.managerId, { attributes: ['id', 'name', 'email'] })
    : null;

  const hoursLogged = await getMonthlyHours(Number(id), month);
  const { percentage, status } = computeCapStatus(hoursLogged, project.monthlyHourCap);

  return res.json({
    project: {
      id: project.id,
      name: project.name,
      clientName: project.clientName,
      monthlyHourCap: project.monthlyHourCap,
      createdBy: project.createdBy,
      managerId: project.managerId,
    },
    manager,
    members: members.map((m: any) => m.user),
    hoursLogged,
    percentage,
    status,
  });
}

export async function updateProjectManager(req: Request, res: Response) {
  const { id } = req.params;
  const { managerId } = req.body;

  if (managerId === undefined) {
    return res.status(400).json({ message: 'managerId is required' });
  }

  const project = await db.Project.findByPk(id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (managerId !== null) {
    const manager = await db.User.findByPk(managerId);
    if (!manager || manager.role === 'member') {
      return res.status(400).json({ message: 'managerId must belong to a pm or admin user' });
    }
  }

  project.managerId = managerId;
  await project.save();

  return res.json({ project });
}

export async function addMember(req: Request, res: Response) {
  const { id } = req.params;
  const { userId } = req.body;
  const user = req.user!;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const project = await db.Project.findByPk(id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const isManagerOrCreator = project.createdBy === user.id || project.managerId === user.id;
  if (user.role !== 'admin' && !isManagerOrCreator) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const targetUser = await db.User.findByPk(userId);
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const existingMembership = await db.ProjectMember.findOne({
    where: { userId, projectId: id },
  });

  if (existingMembership) {
    return res.status(409).json({ message: 'User is already a member of this project' });
  }

  const member = await db.ProjectMember.create({ userId, projectId: id });

  return res.status(201).json({ member });
}
