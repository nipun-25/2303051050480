import React from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, Box, Container } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AlertIcon from '@mui/icons-material/Warning';

interface HeaderProps {
  currentTab: 'all' | 'priority';
  setCurrentTab: (tab: 'all' | 'priority') => void;
  unreadCount: number;
}

/**
 * Responsive Header Component
 * Contains app branding, navigation buttons to toggle tabs, and dynamic unread notification badge.
 */
export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, unreadCount }) => {
  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', boxShadow: 3 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', flexWrap: 'wrap', py: 1 }}>
          
          {/* Logo & Branding */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '250px', mb: { xs: 1, sm: 0 } }}>
            <NotificationsIcon sx={{ fontSize: 28, color: '#00f2fe' }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: '#fff',
                fontFamily: "'Outfit', 'Roboto', sans-serif"
              }}
            >
              Affordmed Campus Portal
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            
            {/* All Notifications tab trigger */}
            <Button
              variant={currentTab === 'all' ? 'contained' : 'text'}
              onClick={() => setCurrentTab('all')}
              sx={{
                color: currentTab === 'all' ? '#1e3c72' : '#fff',
                backgroundColor: currentTab === 'all' ? '#fff' : 'transparent',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
                '&:hover': {
                  backgroundColor: currentTab === 'all' ? '#f0f0f0' : 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              All Notifications
            </Button>

            {/* Priority Notifications tab trigger with Badge */}
            <Badge badgeContent={unreadCount} color="error" overlap="rectangular" sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}>
              <Button
                variant={currentTab === 'priority' ? 'contained' : 'text'}
                onClick={() => setCurrentTab('priority')}
                startIcon={<AlertIcon />}
                sx={{
                  color: currentTab === 'priority' ? '#1e3c72' : '#fff',
                  backgroundColor: currentTab === 'priority' ? '#fff' : 'transparent',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2,
                  '&:hover': {
                    backgroundColor: currentTab === 'priority' ? '#f0f0f0' : 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Priority Board
              </Button>
            </Badge>

          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};
