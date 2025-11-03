import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Construction as ConstructionIcon,
  ViewInAr as ViewInArIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 260;

const Sidebar = ({ open, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isSupervisor } = useAuth();

  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Obras', icon: <ConstructionIcon />, path: '/constructions' },
  ];

  const adminMenuItems = [
    { text: 'Usuários', icon: <PeopleIcon />, path: '/users' },
  ];

  const bottomMenuItems = [
    { text: 'Perfil', icon: <AccountCircleIcon />, path: '/profile' },
    { text: 'Sair', icon: <LogoutIcon />, action: 'logout' },
  ];

  const handleItemClick = (item) => {
    if (item.action === 'logout') {
      logout();
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) {
        onClose();
      }
    }
  };

  const isSelected = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <ViewInArIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Metro SP
        </Typography>
        <Typography variant="caption">
          Gestão de Obras
        </Typography>
      </Box>

      {/* Main Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected(item.path)}
                onClick={() => handleItemClick(item)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isSelected(item.path) ? 'white' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Admin Menu */}
        {isSupervisor() && (
          <>
            <Divider />
            <List>
              {adminMenuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={isSelected(item.path)}
                    onClick={() => handleItemClick(item)}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.main',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: isSelected(item.path) ? 'white' : 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      {/* User Info */}
      {user && (
        <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="body2" fontWeight="bold" noWrap>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user.role}
          </Typography>
        </Box>
      )}

      {/* Bottom Menu */}
      <Divider />
      <List>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(item)}
              sx={{
                color: item.action === 'logout' ? 'error.main' : 'inherit',
              }}
            >
              <ListItemIcon sx={{ color: item.action === 'logout' ? 'error.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box sx={{ width: DRAWER_WIDTH }}>{drawerContent}</Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;

