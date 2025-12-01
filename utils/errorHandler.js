// Utils for error handling
import { HTTP_STATUS } from '../constants/constants.js';

export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const sendErrorResponse = (res, error) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default error
  return res.status(HTTP_STATUS.SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
};

export const tryCatch = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
