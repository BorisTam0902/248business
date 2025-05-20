const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
app.post('/api/events', (req, res) => {
  const events = fs.readJsonSync(EVENTS_FILE);
  const newEvent = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  events.push(newEvent);
  fs.writeJsonSync(EVENTS_FILE, events);
  res.status(201).json(newEvent);
});

// Update event
app.put('/api/events/:id', (req, res) => {
  const events = fs.readJsonSync(EVENTS_FILE);
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });
  
  events[index] = { ...events[index], ...req.body, updatedAt: new Date().toISOString() };
  fs.writeJsonSync(EVENTS_FILE, events);
  res.json(events[index]);
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
  const events = fs.readJsonSync(EVENTS_FILE);
  const filteredEvents = events.filter(e => e.id !== req.params.id);
  fs.writeJsonSync(EVENTS_FILE, filteredEvents);
  res.status(204).send();
});

// Booth routes
app.get('/api/booths', (req, res) => {
  const booths = fs.readJsonSync(BOOTHS_FILE);
  res.json(booths);
});

app.post('/api/booths', upload.array('photos', 5), (req, res) => {
  const booths = fs.readJsonSync(BOOTHS_FILE);
  const newBooth = {
    id: Date.now().toString(),
    ...req.body,
    photos: req.files ? req.files.map(f => f.filename) : [],
    createdAt: new Date().toISOString()
  };
  booths.push(newBooth);
  fs.writeJsonSync(BOOTHS_FILE, booths);
  res.status(201).json(newBooth);
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