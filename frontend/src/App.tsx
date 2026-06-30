import { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Pagination, Alert, CircularProgress, Paper } from '@mui/material';
import { Header } from './components/Header';
import { NotificationList } from './components/NotificationList';
import type { Notification } from './components/NotificationList';
import CheckAllIcon from '@mui/icons-material/DoneAll';

const BACKEND_URL = 'http://localhost:3000/api/v1/notifications';
const AUTH_TOKEN = 'mock-bearer-token-roll-2303051050480-secret-dkvATBGvtUZcgFRc';

function App() {
  const [currentTab, setCurrentTab] = useState<'all' | 'priority'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [filterType, setFilterType] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 4; // Display 4 cards per page for elegant design

  // Headers helper
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  });

  /**
   * Fetch unread notification count
   */
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/unread-count`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  /**
   * Fetch notifications list from backend
   */
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build request query parameters
      const params = new URLSearchParams();
      
      // If we are on the 'all' tab, we support pagination and type filtering
      if (currentTab === 'all') {
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (filterType) {
          params.append('notification_type', filterType);
        }
      } else {
        // Priority Board tab retrieves all items sorted without pagination constraints for a complete board view
        params.append('page', '1');
        params.append('limit', '50');
      }

      const response = await fetch(`${BACKEND_URL}?${params.toString()}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      setNotifications(data.notifications);
      
      if (currentTab === 'all') {
        setTotalPages(data.meta.total_pages);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the server. Make sure the backend is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch notifications list when dependencies change
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [currentTab, page, filterType]);

  /**
   * Mark a specific notification as read
   */
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/${id}/read`, {
        method: 'PATCH',
        headers: getHeaders()
      });

      if (response.ok) {
        // Refresh notifications list and unread count
        fetchNotifications();
        fetchUnreadCount();
      } else {
        alert("Failed to mark notification as read.");
      }
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  /**
   * Bulk mark all notifications as read
   */
  const handleMarkAllRead = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/mark-all-read`, {
        method: 'POST',
        headers: getHeaders()
      });

      if (response.ok) {
        fetchNotifications();
        fetchUnreadCount();
      } else {
        alert("Failed to mark all as read.");
      }
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', pb: 8 }}>
      {/* Header bar */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} unreadCount={unreadCount} />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        
        {/* Title Bar & Options */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3c72', fontFamily: "'Outfit', sans-serif" }}>
              {currentTab === 'all' ? 'All Campus Announcements' : 'Priority Notification Board'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentTab === 'all' 
                ? 'Browse, filter, and view all announcements in chronological pages.' 
                : 'Highly critical unread placement, result, and event alerts consolidated.'}
            </Typography>
          </Box>

          {/* Mark All As Read Button (only show if there are unread notifications) */}
          {unreadCount > 0 && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckAllIcon />}
              onClick={handleMarkAllRead}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 2 }}
            >
              Mark All as Read
            </Button>
          )}
        </Box>

        {/* Filters Panel (Only visible on All Notifications tab) */}
        {currentTab === 'all' && (
          <Paper elevation={1} sx={{ p: 2.5, mb: 4, borderRadius: '12px', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Filters:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="type-filter-label">Notification Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={filterType}
                label="Notification Type"
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1); // Reset to page 1 on filter change
                }}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value=""><em>All Types</em></MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        )}

        {/* Error Handling Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '8px', boxShadow: 1 }} action={
            <Button color="inherit" size="small" onClick={fetchNotifications}>
              Retry
            </Button>
          }>
            {error}
          </Alert>
        )}

        {/* Main List Rendering */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
            <CircularProgress size={50} thickness={4.5} sx={{ color: '#1e3c72' }} />
          </Box>
        ) : (
          <>
            <NotificationList notifications={notifications} onMarkAsRead={handleMarkAsRead} />
            
            {/* Pagination Panel (Only visible on All Notifications tab) */}
            {currentTab === 'all' && totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': { fontWeight: 600 }
                  }}
                />
              </Box>
            )}
          </>
        )}

      </Container>
    </Box>
  );
}

export default App;
