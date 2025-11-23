export interface EarthquakeProperties {
  mag: number;
  place: string;
  time: number;
  updated: number;
  tz?: number;
  url: string;
  detail: string;
  felt?: number;
  cdi?: number;
  mmi?: number;
  alert?: string;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst?: number;
  dmin?: number;
  rms: number;
  gap?: number;
  magType: string;
  type: string;
  title: string;
}

export interface EarthquakeGeometry {
  type: string;
  coordinates: [number, number, number]; // [longitude, latitude, depth]
}

export interface EarthquakeFeature {
  type: string;
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
  id: string;
}

export interface EarthquakeCollection {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
  bbox?: number[];
}

export interface TimeFilter {
  label: string;
  value: string;
  hours: number;
}

export interface MagnitudeFilter {
  min: number;
  max: number;
}

export interface CountryFilter {
  label: string;
  value: string;
  keywords: string[];
}
