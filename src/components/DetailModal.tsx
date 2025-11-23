import type { EarthquakeFeature } from '@/types/earthquake';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface DetailModalProps {
  earthquake: EarthquakeFeature | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function DetailModal({ earthquake, open, onOpenChange }: DetailModalProps) {
  if (!earthquake) return null;

  const { properties, geometry } = earthquake;
  const [longitude, latitude, depth] = geometry.coordinates;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Earthquake Details</DialogTitle>
          <DialogDescription>{getTimeAgo(properties.time)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-baseline gap-3 pb-4 border-b">
            <span className="text-sm text-muted-foreground">Magnitude:</span>
            <span className={`text-5xl font-bold ${getMagnitudeColor(properties.mag)}`}>
              {properties.mag.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">{properties.magType}</span>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
              <span className="text-sm font-semibold text-muted-foreground">Location:</span>
              <span className="text-sm">{properties.place}</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
              <span className="text-sm font-semibold text-muted-foreground">Time:</span>
              <div className="text-sm">
                <div>{formatTime(properties.time)}</div>
                <div className="text-xs text-muted-foreground">UTC</div>
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
              <span className="text-sm font-semibold text-muted-foreground">Last Updated:</span>
              <span className="text-sm">{formatTime(properties.updated)}</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
              <span className="text-sm font-semibold text-muted-foreground">Depth:</span>
              <span className="text-sm">{depth.toFixed(2)} km</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
              <span className="text-sm font-semibold text-muted-foreground">Coordinates:</span>
              <span className="text-sm font-mono">
                {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
              </span>
            </div>

            {properties.felt && (
              <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                <span className="text-sm font-semibold text-muted-foreground">Felt Reports:</span>
                <span className="text-sm">{properties.felt} reports</span>
              </div>
            )}

            {properties.tsunami > 0 && (
              <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                <span className="text-sm font-semibold text-muted-foreground">Tsunami:</span>
                <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
                  Warning Issued
                </span>
              </div>
            )}

            {properties.alert && (
              <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                <span className="text-sm font-semibold text-muted-foreground">Alert Level:</span>
                <span className="text-sm uppercase font-semibold">{properties.alert}</span>
              </div>
            )}

            <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
              <span className="text-sm font-semibold text-muted-foreground">Status:</span>
              <span className="text-sm capitalize">{properties.status}</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
              <span className="text-sm font-semibold text-muted-foreground">Significance:</span>
              <span className="text-sm">{properties.sig}</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
              <span className="text-sm font-semibold text-muted-foreground">Event ID:</span>
              <span className="text-sm font-mono">{earthquake.id}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button asChild className="flex-1">
              <a href={properties.url} target="_blank" rel="noopener noreferrer">
                View on USGS Website
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1"
            >
              <a
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
