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
    image: null,
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
        axios.get('http://localhost:3001/api/events'),
        axios.get('http://localhost:3001/api/booths'),
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
      const formDataToSend = new FormData();
      Object.keys(eventFormData).forEach(key => {
        if (key !== 'image' && eventFormData[key] !== null) {
          formDataToSend.append(key, eventFormData[key]);
        }
      });
      if (eventFormData.image) {
        formDataToSend.append('image', eventFormData.image);
      }

      if (selectedEvent) {
        await axios.put(`http://localhost:3001/api/events/${selectedEvent.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:3001/api/events', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setOpenEventDialog(false);
      fetchData();
      resetEventForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert("Failed to save event. Check browser console for details.");
    }
  };

  const handleBoothSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(boothFormData).forEach(key => {
        if (key === 'photos' && boothFormData[key] instanceof FileList) {
          for (let i = 0; i < boothFormData[key].length; i++) {
            formDataToSend.append('photos', boothFormData[key][i]);
          }
        } else if (boothFormData[key] !== null) {
          formDataToSend.append(key, boothFormData[key]);
        }
      });
      
      if (selectedEvent?.id) {
        formDataToSend.append('eventId', selectedEvent.id);
      } else {
          console.error("No event selected for booth submission.");
          alert("Please select an event first.");
          return;
      }

      await axios.post('http://localhost:3001/api/booths', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOpenBoothDialog(false);
      fetchData();
      resetBoothForm();
    } catch (error) {
      console.error('Error saving booth:', error);
      alert("Failed to save booth. Check browser console for details.");
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:3001/api/${type}/${id}`);
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
      image: null,
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
                  <ListItem 
                    key={event.id} 
                    button 
                    onClick={() => setSelectedEvent(event)}
                    selected={selectedEvent?.id === event.id}
                  >
                    <ListItemText
                      primary={event.name}
                      secondary={new Date(event.date).toLocaleDateString() !== 'Invalid Date' ? new Date(event.date).toLocaleDateString() : event.date}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete('events', event.id);
                        }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete('booths', booth.id);
                          }}
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
                type="text"
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
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 2 }}
              >
                Upload Event Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    setEventFormData({ ...eventFormData, image: e.target.files[0] })
                  }
                />
              </Button>
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