import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

function Admin() {
  const [events, setEvents] = useState([]);
  const [booths, setBooths] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openBoothDialog, setOpenBoothDialog] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
  });
  const [boothFormData, setBoothFormData] = useState({
    name: '',
    description: '',
    contact: '',
    socialMedia: '',
    location: '',
    boothNumber: '',
    photos: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsResponse, boothsResponse] = await Promise.all([
        axios.get('http://localhost:6000/api/events'),
        axios.get('http://localhost:6000/api/booths'),
      ]);
      setEvents(eventsResponse.data);
      setBooths(boothsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        await axios.put(`http://localhost:6000/api/events/${selectedEvent.id}`, eventFormData);
      } else {
        await axios.post('http://localhost:6000/api/events', eventFormData);
      }
      setOpenEventDialog(false);
      fetchData();
      resetEventForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleBoothSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(boothFormData).forEach(key => {
        if (boothFormData[key] !== null) {
          formDataToSend.append(key, boothFormData[key]);
        }
      });
      formDataToSend.append('eventId', selectedEvent.id);

      await axios.post('http://localhost:6000/api/booths', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOpenBoothDialog(false);
      fetchData();
      resetBoothForm();
    } catch (error) {
      console.error('Error saving booth:', error);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:6000/api/${type}/${id}`);
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const resetEventForm = () => {
    setEventFormData({
      name: '',
      description: '',
      date: '',
      location: '',
    });
    setSelectedEvent(null);
  };

  const resetBoothForm = () => {
    setBoothFormData({
      name: '',
      description: '',
      contact: '',
      socialMedia: '',
      location: '',
      boothNumber: '',
      photos: null,
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Events</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    resetEventForm();
                    setOpenEventDialog(true);
                  }}
                >
                  Add Event
                </Button>
              </Box>
              <List>
                {events.map((event) => (
                  <ListItem key={event.id}>
                    <ListItemText
                      primary={event.name}
                      secondary={new Date(event.date).toLocaleDateString()}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => {
                          setSelectedEvent(event);
                          setEventFormData(event);
                          setOpenEventDialog(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete('events', event.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Booths</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    resetBoothForm();
                    setOpenBoothDialog(true);
                  }}
                  disabled={!selectedEvent}
                >
                  Add Booth
                </Button>
              </Box>
              <List>
                {booths
                  .filter((booth) => booth.eventId === selectedEvent?.id)
                  .map((booth) => (
                    <ListItem key={booth.id}>
                      <ListItemText
                        primary={booth.name}
                        secondary={booth.description}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete('booths', booth.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Event Dialog */}
        <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
          <DialogTitle>
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleEventSubmit} sx={{ mt: 2 }} id="event-form">
              <TextField
                fullWidth
                label="Name"
                value={eventFormData.name}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, name: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={eventFormData.description}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, description: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={eventFormData.date}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, date: e.target.value })
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="Location"
                value={eventFormData.location}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, location: e.target.value })
                }
                margin="normal"
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
            <Button type="submit" form="event-form" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Booth Dialog */}
        <Dialog open={openBoothDialog} onClose={() => setOpenBoothDialog(false)}>
          <DialogTitle>Add New Booth</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleBoothSubmit} sx={{ mt: 2 }} id="booth-form">
              <TextField
                fullWidth
                label="Name"
                value={boothFormData.name}
                onChange={(e) =>
                  setBoothFormData({ ...boothFormData, name: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={boothFormData.description}
                onChange={(e) =>
                  setBoothFormData({ ...boothFormData, description: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Contact"
                value={boothFormData.contact}
                onChange={(e) =>
                  setBoothFormData({ ...boothFormData, contact: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Social Media"
                value={boothFormData.socialMedia}
                onChange={(e) =>
                  setBoothFormData({ ...boothFormData, socialMedia: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Location"
                value={boothFormData.location}
                onChange={(e) =>
                  setBoothFormData({ ...boothFormData, location: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Booth Number"
                value={boothFormData.boothNumber}
                onChange={(e) =>
                  setBoothFormData({ ...boothFormData, boothNumber: e.target.value })
                }
                margin="normal"
                required
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 2 }}
              >
                Upload Photos
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) =>
                    setBoothFormData({ ...boothFormData, photos: e.target.files })
                  }
                />
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBoothDialog(false)}>Cancel</Button>
            <Button onClick={handleBoothSubmit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Admin; 