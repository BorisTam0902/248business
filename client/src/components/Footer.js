import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <img 
                src="/Company_Logo.png" 
                alt="MyLifeAdd" 
                style={{ height: 32, width: 'auto' }} 
              />
              <Typography variant="h6" color="text.primary">
                Bazaar Guide
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your one-stop platform for exploring local markets, exhibitions, and carnivals in Hong Kong.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
              <Link href="#" color="inherit">
                <LinkedInIcon />
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/events" color="inherit" display="block" sx={{ mb: 1 }}>
              Events
            </Link>
            <Link component={RouterLink} to="/faq" color="inherit" display="block" sx={{ mb: 1 }}>
              FAQ
            </Link>
            <Link component={RouterLink} to="/privacy" color="inherit" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: info@hkbazaar.com
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Phone: +852 XXXX XXXX
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: 123 Business Street, Hong Kong
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Hong Kong Bazaar Guide. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Powered by
            </Typography>
            <img 
              src="/Company_Logo.png" 
              alt="MyLifeAdd" 
              style={{ height: 20, width: 'auto' }} 
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 