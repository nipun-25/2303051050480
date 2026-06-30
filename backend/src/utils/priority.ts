import { Notification } from '../data/store';

// Priority hierarchy for notification types: Placement is most important, then Result, then Event.
const TYPE_PRIORITY: Record<Notification['type'], number> = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

/**
 * Custom Notification Comparator for priority sorting.
 * Rules:
 * 1. Unread notifications (`is_read === false`) take precedence over read notifications.
 * 2. If status is equal, sort by type hierarchy: Placement (3) > Result (2) > Event (1).
 * 3. If type is also equal, sort by timestamp: newer notifications first (descending).
 * 
 * Returns negative if 'a' has higher priority, positive if 'b' has higher priority, or 0.
 */
export const compareNotifications = (a: Notification, b: Notification): number => {
  // Rule 1: Read status check (unread comes first)
  if (a.is_read !== b.is_read) {
    return a.is_read ? 1 : -1;
  }

  // Rule 2: Notification type priority check
  const priorityA = TYPE_PRIORITY[a.type];
  const priorityB = TYPE_PRIORITY[b.type];
  if (priorityA !== priorityB) {
    return priorityB - priorityA; // Descending (higher priority values first)
  }

  // Rule 3: Recency check (newer first)
  const timeA = new Date(a.timestamp).getTime();
  const timeB = new Date(b.timestamp).getTime();
  return timeB - timeA; // Descending (larger timestamps first)
};
