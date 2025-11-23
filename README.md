# Quake.Earth - Real-time Earthquake Monitoring 🌍

A modern, real-time earthquake monitoring dashboard built with React, TypeScript, and TailwindCSS. Track earthquakes worldwide with interactive maps, detailed timelines, and the latest news.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![Vite](https://img.shields.io/badge/Vite-6-646cff)

## Features

### 🎯 Core Features

- **Latest Earthquake Hero Section**: Displays the most recent earthquake with magnitude, location, time, and depth
- **Interactive Map**: Visualize earthquakes on a world map using Leaflet with magnitude-based marker sizing and colors
- **Timeline View**: Browse recent earthquakes in a list format with filtering options
- **Advanced Filters**:
  - Time window selection (1h, 24h, 7d, 30d)
  - Magnitude slider (0.0 - 9.0)
- **Detailed Information Panel**: Click any earthquake to view comprehensive details
- **News Integration**: Latest earthquake-related news from around the world
- **Dark/Light Mode**: System-aware theme with manual toggle

### 🎨 UI/UX

- **shadcn/ui Components**: Beautiful, accessible UI components
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Smooth Animations**: Powered by Framer Motion
- **Real-time Updates**: Auto-refresh earthquake data every minute

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Maps**: react-leaflet + Leaflet
- **Data Fetching**: SWR (stale-while-revalidate)
- **Animations**: Framer Motion
- **Icons**: Radix Icons + Lucide React

## Data Sources

- **Earthquake Data**: [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)
- **News**: NewsAPI.org (optional, requires API key)

## Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quake.earth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**

   Copy the example env file:
   ```bash
   cp .env.example .env
   ```

   Add your NewsAPI key to `.env`:
   ```env
   VITE_NEWS_API_KEY=your_api_key_here
   ```

   Get a free API key from [newsapi.org](https://newsapi.org/)

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
quake.earth/
├── src/
│   ├── api/                    # API utilities
│   │   ├── earthquakes.ts      # USGS API functions
│   │   └── news.ts             # NewsAPI functions
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── slider.tsx
│   │   │   └── tabs.tsx
│   │   ├── DetailModal.tsx     # Earthquake detail modal
│   │   ├── EarthquakeMarker.tsx # Map marker component
│   │   ├── Filters.tsx         # Filter controls
│   │   ├── LatestQuake.tsx     # Latest earthquake card
│   │   ├── MapView.tsx         # Interactive map
│   │   ├── NewsPanel.tsx       # News section
│   │   ├── Timeline.tsx        # Earthquake timeline
│   │   ├── theme-provider.tsx  # Theme context
│   │   └── theme-toggle.tsx    # Dark/light mode toggle
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── types/                  # TypeScript types
│   │   ├── earthquake.ts       # Earthquake data types
│   │   └── news.ts             # News data types
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── index.html                  # HTML template
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies
```

## API Usage

### USGS Earthquake API

The app uses the following USGS API endpoints:

- **Latest earthquake**:
  ```
  https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=1
  ```

- **Recent earthquakes**:
  ```
  https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=YYYY-MM-DD&endtime=YYYY-MM-DD&minmagnitude=0&limit=500
  ```

No API key required for USGS data.

### NewsAPI (Optional)

To enable the news feature:

1. Sign up at [newsapi.org](https://newsapi.org/)
2. Get your free API key
3. Add it to your `.env` file

The app will work without a news API key, but the news section will be empty.

## Features in Detail

### Latest Earthquake Section
- Shows the most recent earthquake globally
- Displays magnitude with color-coding (green → blue → yellow → orange → red)
- Time shown in local format with "time ago" helper
- Direct links to USGS details and map view

### Interactive Map
- Powered by Leaflet and OpenStreetMap
- Markers sized and colored by magnitude
- Click markers to open detail panel
- Auto-zoom to selected earthquakes
- Displays earthquakes based on active filters

### Timeline & Filters
- Browse all earthquakes matching your criteria
- Time filters: 1 hour, 24 hours, 7 days, 30 days
- Magnitude slider: 0.0 to 9.0
- "Load More" button for additional results
- Click any item to view details

### Detail Modal
- Comprehensive earthquake information
- Coordinates, depth, magnitude, time
- Tsunami warnings (when applicable)
- Alert levels and significance scores
- Direct links to USGS and Google Maps

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Components

To add a new shadcn/ui component:

```bash
npx shadcn-ui@latest add [component-name]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- SWR caching for efficient data fetching
- Automatic revalidation on reconnect
- Optimized re-renders with React hooks
- Lazy loading for better initial load time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or personal use.

## Acknowledgments

- **USGS** for providing free, real-time earthquake data
- **shadcn** for the beautiful UI component library
- **Leaflet** for the mapping library
- **NewsAPI** for news aggregation

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
