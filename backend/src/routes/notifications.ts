import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, Notification } from '../data/store';
import { compareNotifications } from '../utils/priority';

const router = Router();

// Apply authorization guard middleware to all routes in this router
router.use(requireAuth);

/**
 * GET /api/v1/notifications
 * Retrieves a paginated list of notifications, sorted by priority, with optional type filtering.
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const typeFilter = req.query.notification_type as string;

    let items = getNotifications();

    // 1. Filter by notification type if query parameter is provided
    if (typeFilter) {
      items = items.filter(n => n.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // 2. Sort by our priority algorithm
    items.sort(compareNotifications);

    // 3. Paginate
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    res.status(200).json({
      meta: {
        current_page: page,
        total_pages: totalPages || 1,
        total_count: totalCount
      },
      notifications: paginatedItems
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * GET /api/v1/notifications/unread-count
 * Returns the total count of unread notifications.
 */
router.get('/unread-count', (req: Request, res: Response) => {
  try {
    const count = getUnreadCount();
    res.status(200).json({ unread_count: count });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * PATCH /api/v1/notifications/:id/read
 * Marks a specific notification as read.
 */
router.patch('/:id/read', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = markAsRead(id);

    if (!success) {
      res.status(404).json({ error: 'Not Found', message: 'Notification not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * POST /api/v1/notifications/mark-all-read
 * Marks all notifications as read.
 */
router.post('/mark-all-read', (req: Request, res: Response) => {
  try {
    markAllAsRead();
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
