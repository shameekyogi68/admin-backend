// Constants for the application
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
};

export const ADMIN_STATUS = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CONFIRMED: 'confirmed',
};

export const VENDOR_STATUS = {
  APPROVED: 'approved',
  BLOCKED: 'blocked',
  PENDING: 'pending',
};

export const CUSTOMER_STATUS = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  PENDING: 'Pending',
};

export const PLAN_TYPES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
};

export const PLAN_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ADMIN_NOT_FOUND: 'Admin not found',
  ADMIN_EXISTS: 'Admin already exists',
  ACCOUNT_DISABLED: 'Account is disabled',
  NO_TOKEN: 'No token provided',
  INVALID_TOKEN: 'Invalid token',
  UNAUTHORIZED: 'Unauthorized access',
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Admin registered successfully',
  UPDATE_SUCCESS: 'Updated successfully',
  DELETE_SUCCESS: 'Deleted successfully',
  CREATE_SUCCESS: 'Created successfully',
};
