import { permissions, roles } from '../data/constants.js';

export function usernameToEmail(username) {
  const clean = String(username || '').trim().toLowerCase();
  return clean.includes('@') ? clean : `${clean}@ideal.local`;
}

export function can(userRole, permission) {
  if (!userRole) return false;
  const allowed = permissions[userRole] || [];
  return userRole === roles.SUPER_ADMIN || allowed.includes('*') || allowed.includes(permission);
}

export function sanitizeText(value) {
  return String(value ?? '').replace(/[<>]/g, '').trim();
}

export function assertRequired(value, label) {
  if (!String(value ?? '').trim()) throw new Error(`${label} is required.`);
}
