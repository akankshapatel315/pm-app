import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../models';
import { signToken } from '../utils/jwt';
import { ROLES } from '../models/user.model';

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ message: `role must be one of: ${ROLES.join(', ')}` });
  }

  const existing = await db.User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'member',
  });

  const token = signToken({ id: user.id, role: user.role });

  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ id: user.id, role: user.role });

  return res.status(200).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
