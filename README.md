# TastCloud Service Frontend

There is a seeded admin with the log in credentials:

"email": "admin@local.com",
"password": "Admin123$!"

## Features

- 🎫 **Event Management**
  - Browse and search events
  - View event details and schedules
  - Interactive venue maps
  - Event creation and management for administrators

- 🎟️ **Ticket System**
  - Ticket booking and management
  - QR code generation for tickets
  - Ticket details and history
  - Prohibited items information

- 👤 **User Management**
  - User authentication and authorization
  - Profile management
  - Registration and login system

- 📱 **Responsive Design**
  - Responsive components
  - Mobile menu for better navigation
  - Cross-device compatibility

- 🔔 **Notifications**
  - Real-time notifications
  - Notification bell system
  - User alerts and updates

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **UI Libraries**:
  - React 18.3.1
  - FontAwesome for icons
  - React Icons
  - Custom CSS modules
- **State Management & Data Fetching**:
  - SWR for data fetching
  - React Context for state management
- **Authentication**:
  - JWT for authentication
  - Custom auth guards
- **Development Tools**:
  - ESLint for code linting
  - TypeScript for type safety
  - Next.js built-in optimizations

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd FrontEnd
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add necessary environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
# Add other required environment variables
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── bookings/       # Booking related pages
│   ├── events/         # Event related pages
│   ├── mytickets/      # Ticket management pages
│   └── profile/        # User profile pages
├── components/         # Reusable React components
│   ├── ui/            # UI components
│   └── [component files]
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and libraries
├── public/            # Static assets
├── styles/            # Global styles
└── sections/          # Page sections and layouts
```

## Docker Support

The project includes a Dockerfile for containerization. To build and run the Docker container:

```bash
# Build the Docker image
docker build -t tastcloud-frontend .

# Run the container
docker run -p 3000:3000 tastcloud-frontend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
