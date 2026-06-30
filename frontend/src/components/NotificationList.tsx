import React from 'react';
import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

export interface Notification {
  id: string;
  type: 'Placement' | 'Result' | 'Event';
  message: string;
  timestamp: string;
  is_read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

/**
 * Returns icon based on notification type
 */
const getTypeIcon = (type: Notification['type']) => {
  switch (type) {
    case 'Placement':
      return <WorkIcon sx={{ fontSize: 18 }} />;
    case 'Result':
      return <SchoolIcon sx={{ fontSize: 18 }} />;
    case 'Event':
      return <EventIcon sx={{ fontSize: 18 }} />;
  }
};

/**
 * Returns color configurations for each type
 */
const getTypeColor = (type: Notification['type']) => {
  switch (type) {
    case 'Placement':
      return { bg: '#e8f5e9', text: '#2e7d32', border: '#4caf50' };
    case 'Result':
      return { bg: '#e3f2fd', text: '#1565c0', border: '#2196f3' };
    case 'Event':
      return { bg: '#fff3e0', text: '#e65100', border: '#ff9800' };
  }
};

/**
 * NotificationList Component
 * Renders a list of campus notification cards.
 */
export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onMarkAsRead }) => {
  if (notifications.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No notifications found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {notifications.map((n) => {
        const typeStyles = getTypeColor(n.type);
        const formattedDate = new Date(n.timestamp).toLocaleString();

        return (
          <Card
            key={n.id}
            elevation={2}
            sx={{
              position: 'relative',
              borderRadius: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              },
              // Highlighting unread notifications with a thick left border
              borderLeft: `6px solid ${n.is_read ? '#cfd8dc' : typeStyles.border}`,
              backgroundColor: n.is_read ? '#fcfcfc' : '#fff'
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, '&:last-child': { pb: 2 } }}>
              
              {/* Details Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
                  <Chip
                    icon={getTypeIcon(n.type)}
                    label={n.type}
                    size="small"
                    sx={{
                      backgroundColor: typeStyles.bg,
                      color: typeStyles.text,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      '& .MuiChip-icon': { color: typeStyles.text }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {formattedDate}
                  </Typography>
                  {!n.is_read && (
                    <Chip
                      label="New"
                      color="error"
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }}
                    />
                  )}
                </Box>
                
                <Typography variant="body1" sx={{ color: n.is_read ? 'text.secondary' : 'text.primary', fontWeight: n.is_read ? 400 : 500, lineHeight: 1.5 }}>
                  {n.message}
                </Typography>
              </Box>

              {/* Actions Section */}
              <Box sx={{ alignSelf: { xs: 'flex-end', md: 'center' } }}>
                {!n.is_read && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={<DoneIcon />}
                    onClick={() => onMarkAsRead(n.id)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      borderWidth: '1.5px',
                      '&:hover': { borderWidth: '1.5px' }
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
              </Box>

            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
