// Home/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Container,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  SyncAlt,
  AccountCircle,
  Dashboard,
  Settings,
  Menu as MenuIcon,
} from '@mui/icons-material';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 }, minHeight: '64px' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SyncAlt sx={{ fontSize: 24, color: '#3b82f6' }} />
            <Typography
              sx={{
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontSize: '20px',
                color: '#f8fafc',
              }}
            >
              MediaSync
            </Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {['Dashboard', 'Features', 'Pricing'].map((item) => (
              <Button
                key={item}
                sx={{
                  color: '#f8fafc',
                  mx: 1,
                  fontSize: '14px',
                  fontWeight: 500,
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    background: 'transparent',
                  },
                }}
              >
                {item}
              </Button>
            ))}

            {/* User Menu */}
            <IconButton
              size="small"
              onClick={handleMenu}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  background: 'rgba(30, 41, 59, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  minWidth: '180px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {[
                { text: 'Profile', icon: <AccountCircle fontSize="small" /> },
                { text: 'Dashboard', icon: <Dashboard fontSize="small" /> },
                { text: 'Settings', icon: <Settings fontSize="small" /> },
              ].map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={handleClose}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {item.icon}
                    <Typography variant="body2">{item.text}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: 'flex', md: 'none' } }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
