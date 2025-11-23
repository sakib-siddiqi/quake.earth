import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetchRecentEarthquakes, getTimeRange } from '@/api/earthquakes';
import type { EarthquakeFeature, CountryFilter } from '@/types/earthquake';
import { filterEarthquakesByCountry } from '@/lib/countryFilters';
import { EarthquakeMarker } from './EarthquakeMarker';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  selectedEarthquake?: EarthquakeFeature;
  onMarkerClick?: (earthquake: EarthquakeFeature) => void;
  hours?: number;
  minMagnitude?: number;
  countryFilter?: CountryFilter;
}

function MapController({ selectedEarthquake }: { selectedEarthquake?: EarthquakeFeature }) {
  const map = useMap();

  useEffect(() => {
    if (selectedEarthquake) {
      const [longitude, latitude] = selectedEarthquake.geometry.coordinates;
      map.flyTo([latitude, longitude], 6, {
        duration: 1.5,
      });
    }
  }, [selectedEarthquake, map]);

  return null;
}

export function MapView({
  selectedEarthquake,
  onMarkerClick,
  hours = 24,
  minMagnitude = 0,
  countryFilter,
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false);
  const { startTime, endTime } = getTimeRange(hours);

  const { data, error, isLoading } = useSWR(
    ['recent-earthquakes', startTime, endTime, minMagnitude],
    () => fetchRecentEarthquakes(startTime, endTime, minMagnitude, 500),
    {
      refreshInterval: 60000, // Refresh every minute
    }
  );

  // Apply country filter
  const filteredEarthquakes = useMemo(() => {
    if (!data || !countryFilter) return data?.features || [];
    return filterEarthquakesByCountry(data.features, countryFilter);
  }, [data, countryFilter]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Earthquake Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Earthquake Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Loading earthquakes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Earthquake Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Failed to load earthquake data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Earthquake Map</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {filteredEarthquakes.length} earthquakes from the last {hours} hour
            {hours > 1 ? 's' : ''}
            {countryFilter && countryFilter.value !== 'all' && (
              <> in {countryFilter.label}</>
            )}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] rounded-md overflow-hidden border">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredEarthquakes.map((earthquake) => (
                <EarthquakeMarker
                  key={earthquake.id}
                  earthquake={earthquake}
                  onClick={onMarkerClick}
                />
              ))}
              <MapController selectedEarthquake={selectedEarthquake} />
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
