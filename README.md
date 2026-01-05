# Smart Trip Planner

A modern, feature-rich trip planning application built with React, TypeScript, and Vite. Plan your perfect adventure with real-time weather data, explore destinations worldwide, and manage your bookings all in one place.

## Features

### Core Functionality
- **Explore Destinations**: Browse countries and cities with detailed information
- **Activity Planning**: Discover and book activities in your chosen destinations
- **Trip Management**: Create, view, and manage all your trips in one dashboard
- **Weather Integration**: Real-time weather forecasts and historical data
- **Weather Comparison**: Compare weather conditions across multiple cities
- **User Authentication**: Secure login and registration system
- **Protected Routes**: User-specific content and trip management

### Advanced Features
- **Booking System**: Complete trip booking workflow with traveler details and payment
- **Responsive Design**: Beautiful UI optimized for all device sizes
- **Interactive Charts**: Visualize weather data with Chart.js
- **Travel Assistant**: Get personalized recommendations and packing lists
- **Image Galleries**: Browse destination photos before you book

## Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4.x** - Utility-first styling

### Key Libraries
- **Axios** - HTTP client for API requests
- **Chart.js + React-Chartjs-2** - Data visualization
- **React Hook Form + Zod** - Form handling and validation
- **Lucide React** - Beautiful icon set
- **Day.js** - Date manipulation

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite Plugin React** - React fast refresh and JSX support

## Project Structure

```
smart-planner/
├── src/
│   ├── api/              # API configuration and auth endpoints
│   ├── components/       # Reusable React components
│   │   ├── activities/   # Activity-related components
│   │   ├── booking/      # Booking flow components
│   │   ├── cities/       # City display components
│   │   ├── common/       # Shared UI components
│   │   ├── explore/      # Explore page components
│   │   ├── home/         # Home page sections
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   ├── trips/        # Trip management components
│   │   └── weather/      # Weather-related components
│   ├── context/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── BookingContext.tsx
│   ├── data/             # Static data and mock data
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── CitiesPage.tsx
│   │   ├── ActivitiesPage.tsx
│   │   ├── MyTripsPage.tsx
│   │   ├── WeatherComparisonPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/         # External service integrations
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd smart-planner
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production (TypeScript compilation + Vite build)
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint for code quality checks

## Configuration

### Backend API
The application is configured to proxy API requests to a backend server at `http://localhost:8080`. Update the proxy settings in `vite.config.ts` if your backend runs on a different port.

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Environment Variables
Create a `.env` file in the root directory for environment-specific configuration (if needed).

## Key Features Explained

### Authentication System
- User registration and login
- JWT token-based authentication
- Protected routes for authenticated users
- User profile management

### Trip Planning Workflow
1. **Explore** - Browse available countries
2. **Select City** - Choose cities within a country
3. **View Activities** - See available activities and attractions
4. **Book Trip** - Complete booking with traveler details
5. **Manage Trips** - View and track all your bookings

### Weather Features
- 7-day weather forecasts
- Historical weather data
- Multi-city weather comparison
- Best day recommendations based on weather conditions
- Weather warnings and alerts

### Booking System
- Multi-step booking process
- Date selection
- Traveler information collection
- Price breakdown
- Payment form integration
- Booking confirmation

## Development

### Code Style
The project uses ESLint with TypeScript support. Run `npm run lint` to check code quality.

### Type Safety
TypeScript is used throughout the project for type safety. Type definitions are located in the `src/types/` directory.

### Component Organization
Components are organized by feature/domain for better maintainability:
- Feature-specific components in dedicated folders
- Shared components in `common/`
- Layout components separate from page content

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory. The build includes:
- TypeScript compilation
- Minified JavaScript bundles
- Optimized CSS
- Asset optimization

## Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue in the repository.

---

Built with React, TypeScript, and Vite
