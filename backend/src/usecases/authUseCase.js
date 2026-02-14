import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUseCase = async (userData) => {
  const existing = await UserRepository.findByEmail(userData.email);
  if (existing) {
    throw new Error('User already exists with this email');
  }
  const user = await UserRepository.create(userData);
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

export const loginUseCase = async (email, password) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};
