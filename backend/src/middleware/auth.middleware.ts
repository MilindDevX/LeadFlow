import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, IUserPublic } from '../types';
import { AppError } from './error.middleware';

/**
 * Verifies the JWT from the Authorization header or cookie.
 * Attaches the decoded user payload to req.user.
 */
export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  let token: string | undefined;

  // Support both Bearer token (header) and cookie-based auth
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError('Authentication required. Please log in.', 401);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Server configuration error', 500);
  }

  const decoded = jwt.verify(token, secret) as IUserPublic;
  req.user = decoded;

  next();
};
