const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../data/uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Data file paths
const EVENTS_FILE = path.join(__dirname, '../data/events.json');
const BOOTHS_FILE = path.join(__dirname, '../data/booths.json');

// Ensure data files exist
fs.ensureFileSync(EVENTS_FILE);
fs.ensureFileSync(BOOTHS_FILE);

// Initialize empty data if files are empty
if (fs.readFileSync(EVENTS_FILE).length === 0) {
  fs.writeJsonSync(EVENTS_FILE, []);
}
if (fs.readFileSync(BOOTHS_FILE).length === 0) {
  fs.writeJsonSync(BOOTHS_FILE, []);
}

// Routes
// Get all events
app.get('/api/events', (req, res) => {
  const events = fs.readJsonSync(EVENTS_FILE);
  res.json(events);
});

// Get event by ID
app.get('/api/events/:id', (req, res) => {
  const events = fs.readJsonSync(EVENTS_FILE);
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// Create new event
app.post('/api/events', upload.single('image'), (req, res) => {
  console.log('Received request to add new event...');
  console.log('Request Body:', req.body);
  console.log('Uploaded file:', req.file);

  const events = fs.readJsonSync(EVENTS_FILE);
  const newEvent = {
    id: Date.now().toString(),
    ...req.body,
    image: req.file ? req.file.filename : null,
    createdAt: new Date().toISOString()
  };
  events.push(newEvent);
  fs.writeJsonSync(EVENTS_FILE, events);
  console.log('New event added:', newEvent);
  res.status(201).json(newEvent);
});

// Update event
app.put('/api/events/:id', upload.single('image'), (req, res) => {
  console.log(`Received request to update event with ID: ${req.params.id}`);
  console.log('Request Body:', req.body);
  console.log('Uploaded file:', req.file);

  const events = fs.readJsonSync(EVENTS_FILE);
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    console.log(`Event with ID ${req.params.id} not found for update.`);
    return res.status(404).json({ error: 'Event not found' });
  }

  const existingEvent = events[index];
  const updatedEvent = {
    ...existingEvent,
    ...req.body,
    image: req.file ? req.file.filename : existingEvent.image,
    updatedAt: new Date().toISOString()
  };

  events[index] = updatedEvent;
  fs.writeJsonSync(EVENTS_FILE, events);
  console.log('Event updated:', updatedEvent);
  res.json(updatedEvent);
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
  console.log(`Attempting to delete event with ID: ${req.params.id}`);
  const events = fs.readJsonSync(EVENTS_FILE);
  const initialEventCount = events.length;
  const filteredEvents = events.filter(e => e.id !== req.params.id);
  fs.writeJsonSync(EVENTS_FILE, filteredEvents);
  console.log(`Events after filtering: ${filteredEvents.length} (removed ${initialEventCount - filteredEvents.length})`);

  // Also delete associated booths
  console.log(`Attempting to delete booths for event ID: ${req.params.id}`);
  const booths = fs.readJsonSync(BOOTHS_FILE);
  const initialBoothCount = booths.length;
  const filteredBooths = booths.filter(b => b.eventId !== req.params.id);
  fs.writeJsonSync(BOOTHS_FILE, filteredBooths);
  console.log(`Booths after filtering: ${filteredBooths.length} (removed ${initialBoothCount - filteredBooths.length})`);

  res.status(204).send();
});

// Booth routes
app.get('/api/booths', (req, res) => {
  const booths = fs.readJsonSync(BOOTHS_FILE);
  const eventId = req.query.eventId; // Get eventId from query parameters

  if (eventId) {
    // Filter booths by eventId if provided
    const filteredBooths = booths.filter(booth => booth.eventId === eventId);
    res.json(filteredBooths);
  } else {
    // Otherwise, return all booths
    res.json(booths);
  }
});

app.post('/api/booths', upload.array('photos', 5), (req, res) => {
  console.log('Received request to add new booth...');
  console.log('Request Body:', req.body);
  console.log('Uploaded files:', req.files);

  const booths = fs.readJsonSync(BOOTHS_FILE);
  const newBooth = {
    id: Date.now().toString(),
    ...req.body,
    photos: req.files ? req.files.map(f => f.filename) : [],
    createdAt: new Date().toISOString()
  };
  booths.push(newBooth);
  fs.writeJsonSync(BOOTHS_FILE, booths);
  console.log('New booth added:', newBooth);
  res.status(201).json(newBooth);
});

// Delete booth
app.delete('/api/booths/:id', (req, res) => {
  console.log(`Attempting to delete booth with ID: ${req.params.id}`);
  const booths = fs.readJsonSync(BOOTHS_FILE);
  const initialBoothCount = booths.length;
  const filteredBooths = booths.filter(b => b.id !== req.params.id);
  fs.writeJsonSync(BOOTHS_FILE, filteredBooths);
  console.log(`Booths after filtering: ${filteredBooths.length} (removed ${initialBoothCount - filteredBooths.length})`);

  if (initialBoothCount === filteredBooths.length) {
    console.log(`Booth with ID ${req.params.id} not found.`);
    return res.status(404).json({ error: 'Booth not found' });
  }

  res.status(204).send();
});

// Search booths
app.get('/api/booths/search', (req, res) => {
  const { query } = req.query;
  const booths = fs.readJsonSync(BOOTHS_FILE);
  
  const results = booths.filter(booth => 
    booth.name.toLowerCase().includes(query.toLowerCase()) ||
    booth.description.toLowerCase().includes(query.toLowerCase()) ||
    booth.products.some(product => 
      product.toLowerCase().includes(query.toLowerCase())
    )
  );
  
  res.json(results);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 