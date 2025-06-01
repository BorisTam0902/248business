import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Button,
} from '@mui/material';
import axios from 'axios';

function Home() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Attempting to fetch events...');
      const response = await axios.get('http://localhost:3001/api/events');
      console.log('Events fetched successfully:', response.data);
      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.error('Fetched data is not an array:', response.data);
        setEvents([]); // Set to empty array to prevent errors
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]); // Set to empty array to prevent errors
    }
  };

  const filteredEvents = events.filter(event => {
    // Add checks for null/undefined before accessing properties
    const nameMatch = event?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const descriptionMatch = event?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if products is an array before using .some()
    const productsMatch = Array.isArray(event?.products) && event.products.some(product =>
      product?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return nameMatch || descriptionMatch || productsMatch;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upcoming Events
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 4 }}
        />
        <Grid container spacing={4}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={event.image || '/placeholder-event.jpg'}
                  alt={event.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {event.location}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {filteredEvents.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No events found
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home; 