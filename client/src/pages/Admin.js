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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    image: null,
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
        await axios.put(`http://localhost:6000/api/events/${selectedEvent.id}`, formData);
      } else {
        await axios.post('http://localhost:6000/api/events', formData);
      }
      setOpenEventDialog(false);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleBoothSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append('eventId', selectedEvent.id);

      await axios.post('http://localhost:6000/api/booths', formDataToSend);
      setOpenBoothDialog(false);
      fetchData();
      resetForm();
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      location: '',
      image: null,
    });
    setSelectedEvent(null);
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
                    resetForm();
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
                          setFormData(event);
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
                  onClick={() => setOpenBoothDialog(true)}
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
            <Box component="form" onSubmit={handleEventSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
            <Button onClick={handleEventSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Booth Dialog */}
        <Dialog open={openBoothDialog} onClose={() => setOpenBoothDialog(false)}>
          <DialogTitle>Add New Booth</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleBoothSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Social Media"
                value={formData.socialMedia}
                onChange={(e) =>
                  setFormData({ ...formData, socialMedia: e.target.value })
                }
                margin="normal"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                style={{ marginTop: '16px' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBoothDialog(false)}>Cancel</Button>
            <Button onClick={handleBoothSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Admin; 