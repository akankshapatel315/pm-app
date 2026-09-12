import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../models';
import { getMonthRange } from '../utils/date';

export async function createEntry(req: Request, res: Response) {
  const { projectId, date, hours, notes } = req.body;
  const user = req.user!;

  if (!projectId || !date || hours === undefined) {
    return res.status(400).json({ message: 'projectId, date and hours are required' });
  }

  if (typeof hours !== 'number' || !Number.isInteger(hours) || hours <= 0) {
    return res.status(400).json({ message: 'hours must be a positive integer' });
  }

  const project = await db.Project.findByPk(projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const membership = await db.ProjectMember.findOne({
    where: { userId: user.id, projectId },
  });
  if (!membership) {
    return res.status(403).json({ message: 'You are not assigned to this project' });
  }

  const entry = await db.Entry.create({
    projectId,
    userId: user.id,
    date,
    hours,
    notes: notes ?? null,
  });

  return res.status(201).json({ entry });
}

export async function listMyEntries(req: Request, res: Response) {
  const user = req.user!;
  const { projectId, month } = req.query as { projectId?: string; month?: string };

  const where: Record<string, unknown> = { userId: user.id };
  if (projectId) {
    where.projectId = projectId;
  }

  const { start, end } = getMonthRange(month);
  where.date = { [Op.between]: [start, end] };

  const entries = await db.Entry.findAll({ where, order: [['date', 'DESC']] });

  return res.json({ entries });
}
