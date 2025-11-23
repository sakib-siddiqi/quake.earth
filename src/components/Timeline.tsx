import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetchRecentEarthquakes, getTimeRange } from '@/api/earthquakes';
import type { EarthquakeFeature, CountryFilter } from '@/types/earthquake';
import { filterEarthquakesByCountry } from '@/lib/countryFilters';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface TimelineProps {
  hours: number;
  minMagnitude: number;
  onItemClick?: (earthquake: EarthquakeFeature) => void;
  countryFilter?: CountryFilter;
}

const getMagnitudeColor = (mag: number): string => {
  if (mag >= 7) return 'bg-red-600 dark:bg-red-400';
  if (mag >= 6) return 'bg-orange-600 dark:bg-orange-400';
  if (mag >= 5) return 'bg-yellow-600 dark:bg-yellow-400';
  if (mag >= 4) return 'bg-blue-600 dark:bg-blue-400';
  return 'bg-green-600 dark:bg-green-400';
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export function Timeline({ hours, minMagnitude, onItemClick, countryFilter }: TimelineProps) {
  const [displayCount, setDisplayCount] = useState(10);
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

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Earthquakes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Earthquakes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load earthquake data</p>
        </CardContent>
      </Card>
    );
  }

  const displayedEarthquakes = filteredEarthquakes.slice(0, displayCount);
  const hasMore = filteredEarthquakes.length > displayCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Earthquakes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {displayedEarthquakes.length} of {filteredEarthquakes.length} earthquakes
            {countryFilter && countryFilter.value !== 'all' && (
              <> in {countryFilter.label}</>
            )}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayedEarthquakes.map((earthquake, index) => {
              const { properties, geometry } = earthquake;
              const [longitude, latitude, depth] = geometry.coordinates;

              return (
                <motion.div
                  key={earthquake.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div
                    className="group p-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-all cursor-pointer"
                    onClick={() => onItemClick?.(earthquake)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${getMagnitudeColor(
                          properties.mag
                        )} text-white font-bold flex-shrink-0`}
                      >
                        {properties.mag.toFixed(1)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                          {properties.place}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Time:</span> {getTimeAgo(properties.time)}
                          </div>
                          <div>
                            <span className="font-medium">Depth:</span> {depth.toFixed(1)} km
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Coordinates:</span> {latitude.toFixed(2)}
                            °, {longitude.toFixed(2)}°
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {formatTime(properties.time)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => setDisplayCount((prev) => prev + 10)}>
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
