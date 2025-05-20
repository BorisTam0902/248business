import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
} from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Hong Kong Bazaar Guide
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop platform for exploring local markets and exhibitions in Hong Kong.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block">
              Home
            </Link>
            <Link component={RouterLink} to="/faq" color="inherit" display="block">
              FAQ
            </Link>
            <Link component={RouterLink} to="/privacy" color="inherit" display="block">
              Privacy Policy
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@hkbazaar.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +852 1234 5678
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: 123 Market Street, Hong Kong
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Hong Kong Bazaar Guide. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Powered by{' '}
            <Link
              href="https://www.mylifeadd.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              MyLifeAdd Company Limited
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 