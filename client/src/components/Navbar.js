import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Event as EventIcon,
  AdminPanelSettings as AdminIcon,
  Help as HelpIcon,
  PrivacyTip as PrivacyIcon,
} from '@mui/icons-material';

const pages = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Events', path: '/events', icon: <EventIcon /> },
  { name: 'FAQ', path: '/faq', icon: <HelpIcon /> },
  { name: 'Privacy', path: '/privacy', icon: <PrivacyIcon /> },
];

const settings = [
  { name: 'Admin Panel', path: '/admin', icon: <AdminIcon /> },
];

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ 
          textDecoration: 'none', 
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <img 
            src="/Company_Logo.png" 
            alt="MyLifeAdd" 
            style={{ height: 32, width: 'auto' }} 
          />
          Bazaar Guide
        </Typography>
      </Box>
      <List>
        {pages.map((page) => (
          <ListItem 
            key={page.name} 
            component={RouterLink} 
            to={page.path}
            sx={{ 
              color: 'inherit',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText primary={page.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'text.primary',
                }}
              >
                <img 
                  src="/Company_Logo.png" 
                  alt="MyLifeAdd" 
                  style={{ height: 32, width: 'auto' }} 
                />
                Bazaar Guide
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    component={RouterLink}
                    to={page.path}
                    sx={{ 
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    {page.icon}
                    {page.name}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Admin" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting.name} 
                  component={RouterLink} 
                  to={setting.path}
                  onClick={handleCloseUserMenu}
                >
                  <ListItemIcon>{setting.icon}</ListItemIcon>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 