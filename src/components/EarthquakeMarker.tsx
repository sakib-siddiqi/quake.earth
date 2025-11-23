import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { EarthquakeFeature } from '@/types/earthquake';

interface EarthquakeMarkerProps {
  earthquake: EarthquakeFeature;
  onClick?: (earthquake: EarthquakeFeature) => void;
}

const getMarkerColor = (mag: number): string => {
  if (mag >= 7) return '#dc2626';
  if (mag >= 6) return '#ea580c';
  if (mag >= 5) return '#ca8a04';
  if (mag >= 4) return '#2563eb';
  return '#16a34a';
};

const getMarkerSize = (mag: number): number => {
  if (mag >= 7) return 20;
  if (mag >= 6) return 16;
  if (mag >= 5) return 12;
  if (mag >= 4) return 8;
  return 6;
};

const createCustomIcon = (mag: number) => {
  const color = getMarkerColor(mag);
  const size = getMarkerSize(mag);

  const svgIcon = `
    <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" opacity="0.6" />
      <circle cx="12" cy="12" r="6" fill="${color}" />
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-earthquake-marker',
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
  });
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export function EarthquakeMarker({ earthquake, onClick }: EarthquakeMarkerProps) {
  const { properties, geometry } = earthquake;
  const [longitude, latitude, depth] = geometry.coordinates;

  return (
    <Marker
      position={[latitude, longitude]}
      icon={createCustomIcon(properties.mag)}
      eventHandlers={{
        click: () => onClick?.(earthquake),
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-bold text-lg mb-2">
            M {properties.mag.toFixed(1)} - {properties.place}
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Time:</span> {formatTime(properties.time)}
            </p>
            <p>
              <span className="font-semibold">Depth:</span> {depth.toFixed(1)} km
            </p>
            <p>
              <span className="font-semibold">Coordinates:</span> {latitude.toFixed(4)}°,{' '}
              {longitude.toFixed(4)}°
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
