export const APP_NAME = 'Ideal Coaching Center Management System';
export const CENTER_NAME = 'Ideal Coaching Center';
export const TZ = 'Asia/Dhaka';

export const roles = {
  SUPER_ADMIN: 'Super Admin',
  FEE_COLLECTOR: 'Fee Collector',
  RESULT_MANAGER: 'Result Manager'
};

export const permissions = {
  [roles.SUPER_ADMIN]: ['*'],
  [roles.FEE_COLLECTOR]: ['students:read', 'payments:write', 'payments:read', 'invoices:read', 'reports:limited'],
  [roles.RESULT_MANAGER]: ['students:read', 'exams:write', 'results:write', 'results:read']
};

export const paymentTypes = ['Monthly Fee', 'Exam Fee', 'Sheet Fee', 'Admission Fee', 'Other Fees'];
export const paymentMethods = ['Cash', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer'];
export const subjects = ['ICT', 'English', 'Both', 'Others'];
export const studentStatuses = ['Active', 'Inactive'];
export const genders = ['Male', 'Female', 'Other'];
export const collections = {
  students: 'students',
  payments: 'payments',
  paymentHistory: 'paymentHistory',
  dues: 'dues',
  classes: 'classes',
  batches: 'batches',
  exams: 'exams',
  results: 'results',
  users: 'users',
  settings: 'settings',
  notifications: 'notifications',
  invoices: 'invoices',
  attendanceLogs: 'attendanceLogs',
  activityLogs: 'activityLogs'
};
