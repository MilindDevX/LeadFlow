import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { AppError } from './error.middleware';

/**
 * Returns middleware that restricts access to users with specified roles.
 * Must be used AFTER the authenticate middleware.
 *
 * Usage: router.delete('/:id', authenticate, requireRole('admin'), controller)
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Required role: ${roles.join(' or ')}`,
        403
      );
    }

    next();
  };
};
