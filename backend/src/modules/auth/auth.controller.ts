import { Request, Response } from 'express';
import * as authService from './auth.service';
import { AuthenticatedRequest } from '../../types';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

/**
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const { user, token } = await authService.registerUser({ name, email, password, role });

  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user, token },
  });
};

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const { user, token } = await authService.loginUser({ email, password });

  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user, token },
  });
};

/**
 * POST /api/auth/logout
 */
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const user = await authService.getMe(userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
};
