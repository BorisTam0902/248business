# Hong Kong Bazaar Guide

A platform for exploring local markets and exhibitions in Hong Kong, helping visitors find and navigate through various booths and stalls.

## Features

- Browse upcoming events and exhibitions
- View detailed information about each booth
- Interactive floor maps with booth locations
- Search and filter booths by products
- Admin panel for managing events and booths
- Mobile-friendly design

## Tech Stack

- Frontend: React with Material-UI
- Backend: Node.js with Express
- Data Storage: JSON files (can be migrated to a database)
- Maps: Leaflet with OpenStreetMap

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bazaar-platform
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd ../client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:6000

## Deployment Instructions

### Local Development

The application is configured to run on port 6000 by default. You can change this by modifying the `PORT` environment variable in the server's `.env` file.

### Production Deployment

1. Build the client:
```bash
cd client
npm run build
```

2. Set up environment variables:
```bash
# server/.env
PORT=6000
NODE_ENV=production
```

3. Start the server:
```bash
cd server
npm start
```

### AWS Deployment

1. Create an EC2 instance
2. Install Node.js and npm
3. Clone the repository
4. Build the client
5. Start the server
6. Configure security groups to allow traffic on port 6000
7. Set up a domain name and SSL certificate

### GoDaddy Configuration

1. Purchase a domain
2. Configure DNS settings to point to your AWS instance
3. Set up SSL certificate
4. Configure reverse proxy (e.g., Nginx) to forward requests to the Node.js server

## Data Management

The application uses JSON files for data storage:
- `data/events.json`: Stores event information
- `data/booths.json`: Stores booth information
- `data/uploads/`: Stores uploaded images

To migrate to a database:
1. Create appropriate database tables
2. Update server code to use database queries
3. Migrate existing data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by MyLifeAdd Company Limited
- Map data from OpenStreetMap
- Icons from Material-UI 