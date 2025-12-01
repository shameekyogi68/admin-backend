// Validation utilities
import { AppError } from './errorHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/constants.js';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};

export const validateAdmin = (adminData) => {
  const { name, email, password, role } = adminData;

  if (!name || !email || !password) {
    throw new AppError(
      ERROR_MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (!validateEmail(email)) {
    throw new AppError('Invalid email format', HTTP_STATUS.BAD_REQUEST);
  }

  if (!validatePassword(password)) {
    throw new AppError(
      'Password must be at least 6 characters',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  return true;
};

export const validatePlan = (planData) => {
  const { name, price, duration, planType } = planData;

  if (!name || !price || !duration || !planType) {
    throw new AppError(
      'All fields are required',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (price <= 0) {
    throw new AppError('Price must be positive', HTTP_STATUS.BAD_REQUEST);
  }

  return true;
};

export const validateBooking = (bookingData) => {
  const { vendorId, customerName, services } = bookingData;

  if (!vendorId || !customerName || !services || services.length === 0) {
    throw new AppError(
      'All fields are required',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  return true;
};
