import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: { username: string; iat: number };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Missing or invalid authorization header');
    return res.status(401).json({ ok: false, error: 'Missing authorization token' });
  }

  const token = authHeader.substring(7);

  try {
    const secret = process.env.JWT_SECRET || 'devsecret';
    const decoded = jwt.verify(token, secret) as { username: string; iat: number };
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token:', error);
    return res.status(401).json({ ok: false, error: 'Invalid token' });
  }
};

export const generateToken = (username: string): string => {
  const secret = process.env.JWT_SECRET || 'devsecret';
  return jwt.sign({ username }, secret, { expiresIn: '24h' });
};
