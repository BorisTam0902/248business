import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';

function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Hong Kong Bazaar Guide
          </Typography>
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              sx={{ mx: 1 }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/admin"
              sx={{ mx: 1 }}
            >
              Admin
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/faq"
              sx={{ mx: 1 }}
            >
              FAQ
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/privacy"
              sx={{ mx: 1 }}
            >
              Privacy
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 