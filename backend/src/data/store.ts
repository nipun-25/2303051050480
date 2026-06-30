export interface Notification {
  id: string;
  type: 'Placement' | 'Result' | 'Event';
  message: string;
  timestamp: string; // ISO-like datetime format
  is_read: boolean;
}

// In-Memory Database containing mock campus notification records
export let notificationsDb: Notification[] = [
  {
    id: "n1",
    type: "Placement",
    message: "Google Campus Recruitment Drive - Registered profiles review complete.",
    timestamp: "2026-06-30T10:00:00.000Z",
    is_read: false
  },
  {
    id: "n2",
    type: "Result",
    message: "Mathematics IV Mid-Semester exam grades published.",
    timestamp: "2026-06-30T09:30:00.000Z",
    is_read: false
  },
  {
    id: "n3",
    type: "Event",
    message: "Annual Hackathon 'CodeStorm 2026' registration starts today.",
    timestamp: "2026-06-30T09:00:00.000Z",
    is_read: false
  },
  {
    id: "n4",
    type: "Placement",
    message: "Microsoft Internships: Mock Interviews scheduled for Friday.",
    timestamp: "2026-06-29T14:00:00.000Z",
    is_read: true
  },
  {
    id: "n5",
    type: "Result",
    message: "Data Structures & Algorithms end-semester final results declared.",
    timestamp: "2026-06-29T11:00:00.000Z",
    is_read: false
  },
  {
    id: "n6",
    type: "Event",
    message: "Guest Lecture: 'Introduction to AI Agents' by DeepMind researchers.",
    timestamp: "2026-06-28T16:00:00.000Z",
    is_read: true
  },
  {
    id: "n7",
    type: "Placement",
    message: "Amazon AWS Academy: Cloud Architecture Certifications voucher code distribution.",
    timestamp: "2026-06-28T09:00:00.000Z",
    is_read: false
  },
  {
    id: "n8",
    type: "Event",
    message: "Campus sports meet: Cricket Tournament registrations open.",
    timestamp: "2026-06-27T10:00:00.000Z",
    is_read: true
  }
];

/**
 * Retrieve all notification records.
 */
export const getNotifications = (): Notification[] => {
  return [...notificationsDb];
};

/**
 * Count unread notifications.
 */
export const getUnreadCount = (): number => {
  return notificationsDb.filter(n => !n.is_read).length;
};

/**
 * Mark a specific notification as read by ID.
 */
export const markAsRead = (id: string): boolean => {
  const notification = notificationsDb.find(n => n.id === id);
  if (notification) {
    notification.is_read = true;
    return true;
  }
  return false;
};

/**
 * Mark all notifications as read.
 */
export const markAllAsRead = (): void => {
  notificationsDb.forEach(n => {
    n.is_read = true;
  });
};
