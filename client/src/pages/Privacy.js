import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Privacy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Information Collection
          </Typography>
          <Typography paragraph>
            We collect minimal information necessary to provide our services. This includes:
          </Typography>
          <ul>
            <li>Basic contact information for booth owners</li>
            <li>Event details and booth information</li>
            <li>Public contact information for business inquiries</li>
          </ul>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Information Usage
          </Typography>
          <Typography paragraph>
            The information we collect is used to:
          </Typography>
          <ul>
            <li>Display booth and event information to visitors</li>
            <li>Facilitate communication between visitors and booth owners</li>
            <li>Improve our platform's functionality</li>
          </ul>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Data Protection
          </Typography>
          <Typography paragraph>
            We implement appropriate security measures to protect your information. We do not sell or share your personal data with third parties.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about our privacy policy, please contact us at:
            <br />
            Email: privacy@hkbazaar.com
            <br />
            Phone: +852 XXXX XXXX
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Privacy; 