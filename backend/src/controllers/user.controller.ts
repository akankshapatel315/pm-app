import { Request, Response } from 'express';
import db from '../models';
import { ROLES, UserRole } from '../models/user.model';

export async function listUsers(req: Request, res: Response) {
  const { role } = req.query as { role?: string };

  if (role && !ROLES.includes(role as UserRole)) {
    return res.status(400).json({ message: `role must be one of: ${ROLES.join(', ')}` });
  }

  const users = await db.User.findAll({
    where: role ? { role } : {},
    attributes: ['id', 'name', 'email', 'role'],
    order: [['name', 'ASC']],
  });

  return res.json({ users });
}
