import jwt from 'jsonwebtoken';
import User from '../../models/user.model';
import { IUserPublic, UserRole } from '../../types';
import { AppError } from '../../middleware/error.middleware';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResult {
  user: IUserPublic;
  token: string;
}

/**
 * Generates a signed JWT containing the user's public profile.
 */
const generateToken = (user: IUserPublic): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError('Server configuration error', 500);

  return jwt.sign(
    { _id: user._id, name: user.name, email: user.email, role: user.role },
    secret,
    { expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d' }
  );
};

/**
 * Registers a new user. Throws if email is already taken.
 */
export const registerUser = async (payload: RegisterPayload): Promise<AuthResult> => {
  const { name, email, password, role } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create({ name, email, password, role });

  const publicUser: IUserPublic = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(publicUser);

  return { user: publicUser, token };
};

/**
 * Authenticates a user by email + password.
 * Uses a single generic error message to prevent user enumeration.
 */
export const loginUser = async (payload: LoginPayload): Promise<AuthResult> => {
  const { email, password } = payload;

  // Explicitly select password (hidden by default via `select: false`)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const publicUser: IUserPublic = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(publicUser);

  return { user: publicUser, token };
};

/**
 * Returns the current authenticated user's public profile.
 */
export const getMe = async (userId: string): Promise<IUserPublic> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
