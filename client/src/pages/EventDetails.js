import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [booths, setBooths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (id) {
      fetchEventDetails(id);
      fetchBooths(id);
    }
  }, [id]);

  const fetchEventDetails = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const fetchBooths = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/booths?eventId=${eventId}`);
      setBooths(response.data);
    } catch (error) {
      console.error('Error fetching booths:', error);
    }
  };

  const filteredBooths = booths.filter(booth =>
    booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booth.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booth.products.some(product =>
      product.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (!event) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {event.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Date: {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location: {event.location}
          </Typography>
        </Box>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Booths" />
          <Tab label="Map" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search booths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ my: 4 }}
            />
            <Grid container spacing={4}>
              {filteredBooths.map((booth) => (
                <Grid item xs={12} sm={6} md={4} key={booth.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {booth.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {booth.description}
                      </Typography>
                      <Typography variant="body2">
                        Products: {Array.isArray(booth.products) ? booth.products.join(', ') : 'N/A'}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          Contact: {booth.contact}
                        </Typography>
                        {booth.socialMedia && (
                          <Typography variant="body2">
                            Social: {booth.socialMedia}
                          </Typography>
                        )}
                        {/* Display Photos */}
                        {Array.isArray(booth.photos) && booth.photos.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>Photos:</Typography>
                            <Grid container spacing={1}>
                              {booth.photos.map((photo, index) => (
                                <Grid item xs={4} sm={3} md={2} key={index}>
                                  <img 
                                    src={`http://localhost:3001/uploads/${photo}`} // Assuming uploads are served from /uploads
                                    alt={`Booth photo ${index + 1}`}
                                    style={{ width: '100%', height: 'auto', borderRadius: 4 }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <Paper sx={{ height: 500, mt: 4 }}>
            <MapContainer
              center={[22.3193, 114.1694]} // Hong Kong coordinates
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {booths.map((booth) => (
                <Marker
                  key={booth.id}
                  position={[booth.location.lat, booth.location.lng]}
                >
                  <Popup>
                    <Typography variant="subtitle1">{booth.name}</Typography>
                    <Typography variant="body2">{booth.description}</Typography>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default EventDetails; 