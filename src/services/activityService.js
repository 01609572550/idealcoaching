import { createDoc } from './firestoreService.js';
import { collections } from '../data/constants.js';
import { bdDateTime } from '../utils/date.js';

export async function logActivity(user, action, details = {}) {
  return createDoc(collections.activityLogs, {
    action,
    details,
    userId: user?.uid || '',
    userName: user?.displayName || user?.email || 'System',
    createdAt: new Date().toISOString(),
    createdAtBd: bdDateTime()
  });
}
