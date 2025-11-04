import React, { useState, useEffect } from 'react';
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
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Construction as ConstructionIcon,
  ViewInAr as ViewInArIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH_EXPANDED = 280;
const DRAWER_WIDTH_COLLAPSED = 70;
const STORAGE_KEY = 'sidebar-collapsed';

const Sidebar = ({ open, onClose, isMobile, collapsed, onToggleCollapse }) => {
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

  const renderMenuItem = (item, isBottomItem = false) => {
    const selected = isSelected(item.path);
    const content = (
      <ListItemButton
        selected={selected}
        onClick={() => handleItemClick(item)}
        sx={{
          minHeight: 48,
          justifyContent: collapsed ? 'center' : 'initial',
          px: collapsed ? 2 : 2.5,
          py: 1.5,
          borderRadius: 2,
          mb: 0.5,
          mx: 1,
          transition: 'all 0.3s ease-in-out',
          '&.Mui-selected': {
            bgcolor: 'rgba(4, 85, 191, 0.12)',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'rgba(4, 85, 191, 0.16)',
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.main',
            },
          },
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.04)',
          },
          ...(item.action === 'logout' && {
            color: 'error.main',
            '& .MuiListItemIcon-root': {
              color: 'error.main',
            },
            '&:hover': {
              bgcolor: 'rgba(238, 49, 36, 0.08)',
            },
          }),
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: collapsed ? 0 : 2,
            justifyContent: 'center',
            fontSize: '1.5rem',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              fontSize: '0.9375rem',
              fontWeight: selected ? 600 : 500,
            }}
          />
        )}
      </ListItemButton>
    );

    if (collapsed) {
      return (
        <Tooltip title={item.text} placement="right" key={item.text} arrow>
          <ListItem disablePadding>
            {content}
          </ListItem>
        </Tooltip>
      );
    }

    return (
      <ListItem key={item.text} disablePadding>
        {content}
      </ListItem>
    );
  };

  const drawerContent = (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        bgcolor: '#FFFFFF',
      }}
    >
      {/* Logo & Toggle */}
      <Box 
        sx={{ 
          p: collapsed ? 2 : 3, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: collapsed ? 0 : 2,
          flex: 1,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <ViewInArIcon 
            sx={{ 
              fontSize: collapsed ? 32 : 40,
              color: 'primary.main',
              transition: 'all 0.3s ease-in-out',
            }} 
          />
          {!collapsed && (
            <Box sx={{ opacity: 1, transition: 'opacity 0.3s ease-in-out' }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Metro SP
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Gestão de Obras
              </Typography>
            </Box>
          )}
        </Box>
        {!isMobile && !collapsed && (
          <IconButton 
            onClick={onToggleCollapse}
            size="small"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Collapsed Toggle Button */}
      {!isMobile && collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <IconButton 
            onClick={onToggleCollapse}
            size="small"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      )}

      {/* Main Menu */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        py: 2,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
        },
      }}>
        <List sx={{ px: 0 }}>
          {mainMenuItems.map((item) => renderMenuItem(item))}
        </List>

        {/* Admin Menu */}
        {isSupervisor() && (
          <>
            <Divider sx={{ my: 2, mx: 2 }} />
            {!collapsed && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ px: 3, py: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                Administração
              </Typography>
            )}
            <List sx={{ px: 0 }}>
              {adminMenuItems.map((item) => renderMenuItem(item))}
            </List>
          </>
        )}
      </Box>

      {/* User Info */}
      {user && (
        <Box 
          sx={{ 
            p: collapsed ? 1.5 : 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          {collapsed ? (
            <Tooltip title={`${user.name} (${user.role})`} placement="right" arrow>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </Box>
            </Tooltip>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight="600" noWrap>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.role}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Bottom Menu */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 1 }}>
        <List sx={{ px: 0 }}>
          {bottomMenuItems.map((item) => renderMenuItem(item, true))}
        </List>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box sx={{ width: DRAWER_WIDTH_EXPANDED }}>{drawerContent}</Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED,
        flexShrink: 0,
        transition: 'width 0.3s ease-in-out',
        '& .MuiDrawer-paper': {
          width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          border: 'none',
          boxShadow: '1px 0 8px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;

