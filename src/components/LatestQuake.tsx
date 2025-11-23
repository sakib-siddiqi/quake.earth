import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetchLatestEarthquake } from '@/api/earthquakes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { EarthquakeFeature } from '@/types/earthquake';

interface LatestQuakeProps {
  onViewMap?: (earthquake: EarthquakeFeature) => void;
}

const getMagnitudeColor = (mag: number): string => {
  if (mag >= 7) return 'text-red-600 dark:text-red-400';
  if (mag >= 6) return 'text-orange-600 dark:text-orange-400';
  if (mag >= 5) return 'text-yellow-600 dark:text-yellow-400';
  if (mag >= 4) return 'text-blue-600 dark:text-blue-400';
  return 'text-green-600 dark:text-green-400';
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

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export function LatestQuake({ onViewMap }: LatestQuakeProps) {
  const { data, error, isLoading } = useSWR('latest-earthquake', fetchLatestEarthquake, {
    refreshInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Latest Earthquake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.features.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Latest Earthquake</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load earthquake data</p>
        </CardContent>
      </Card>
    );
  }

  const earthquake = data.features[0];
  const { properties, geometry } = earthquake;
  const [longitude, latitude, depth] = geometry.coordinates;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Latest Earthquake</CardTitle>
          <CardDescription>{getTimeAgo(properties.time)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground">Magnitude:</span>
              <span className={`text-4xl font-bold ${getMagnitudeColor(properties.mag)}`}>
                {properties.mag.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">{properties.magType}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-sm text-muted-foreground min-w-20">Location:</span>
                <span className="font-medium">{properties.place}</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sm text-muted-foreground min-w-20">Time:</span>
                <div className="flex flex-col">
                  <span className="text-sm">{formatTime(properties.time)}</span>
                  <span className="text-xs text-muted-foreground">UTC</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sm text-muted-foreground min-w-20">Depth:</span>
                <span className="text-sm">{depth.toFixed(1)} km</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sm text-muted-foreground min-w-20">Coordinates:</span>
                <span className="text-sm font-mono">
                  {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => onViewMap?.(earthquake)}>View on Map</Button>
            <Button variant="outline" asChild>
              <a href={properties.url} target="_blank" rel="noopener noreferrer">
                USGS Details
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
