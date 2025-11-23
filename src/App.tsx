import { useState, useRef } from 'react';
import { SWRConfig } from 'swr';
import { LatestQuake } from './components/LatestQuake';
import { MapView } from './components/MapView';
import { Timeline } from './components/Timeline';
import { Filters, timeFilters } from './components/Filters';
import { DetailModal } from './components/DetailModal';
import { NewsPanel } from './components/NewsPanel';
import { ThemeToggle } from './components/theme-toggle';
import type { EarthquakeFeature, TimeFilter } from './types/earthquake';

function App() {
  const [selectedEarthquake, setSelectedEarthquake] = useState<EarthquakeFeature | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>(timeFilters[1]); // 24h default
  const [minMagnitude, setMinMagnitude] = useState(0);

  const mapRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);

  const handleViewMap = (earthquake: EarthquakeFeature) => {
    setSelectedEarthquake(earthquake);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleMarkerClick = (earthquake: EarthquakeFeature) => {
    setSelectedEarthquake(earthquake);
    setDetailModalOpen(true);
  };

  const handleTimelineItemClick = (earthquake: EarthquakeFeature) => {
    setSelectedEarthquake(earthquake);
    setDetailModalOpen(true);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}
    >
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quake.Earth
              </h1>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Real-time Earthquake Monitoring
              </span>
            </div>

            <nav className="flex items-center gap-2 sm:gap-6">
              <button
                onClick={() => scrollToSection(mapRef)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:inline"
              >
                Map
              </button>
              <button
                onClick={() => scrollToSection(timelineRef)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:inline"
              >
                Timeline
              </button>
              <button
                onClick={() => scrollToSection(newsRef)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:inline"
              >
                News
              </button>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Latest Earthquake Section */}
            <section>
              <LatestQuake onViewMap={handleViewMap} />
            </section>

            {/* Filters Section */}
            <section>
              <Filters
                selectedTime={selectedTimeFilter}
                onTimeChange={setSelectedTimeFilter}
                minMagnitude={minMagnitude}
                onMagnitudeChange={setMinMagnitude}
              />
            </section>

            {/* Map Section */}
            <section ref={mapRef} id="map">
              <MapView
                selectedEarthquake={selectedEarthquake ?? undefined}
                onMarkerClick={handleMarkerClick}
                hours={selectedTimeFilter.hours}
                minMagnitude={minMagnitude}
              />
            </section>

            {/* Timeline Section */}
            <section ref={timelineRef} id="timeline">
              <Timeline
                hours={selectedTimeFilter.hours}
                minMagnitude={minMagnitude}
                onItemClick={handleTimelineItemClick}
              />
            </section>

            {/* News Section */}
            <section ref={newsRef} id="news">
              <NewsPanel />
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>
                Data provided by{' '}
                <a
                  href="https://earthquake.usgs.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  USGS Earthquake Hazards Program
                </a>
              </p>
              <p>Built with React, TypeScript, and Tailwind CSS</p>
            </div>
          </div>
        </footer>

        {/* Detail Modal */}
        <DetailModal
          earthquake={selectedEarthquake}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      </div>
    </SWRConfig>
  );
}

export default App;
