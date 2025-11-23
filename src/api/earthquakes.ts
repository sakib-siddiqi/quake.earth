import type { EarthquakeCollection } from '@/types/earthquake';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

export const fetchLatestEarthquake = async (): Promise<EarthquakeCollection> => {
  const url = `${USGS_BASE_URL}?format=geojson&orderby=time&limit=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch latest earthquake');
  }

  return response.json();
};

export const fetchRecentEarthquakes = async (
  startTime: string,
  endTime: string,
  minMagnitude = 0,
  limit = 100
): Promise<EarthquakeCollection> => {
  const url = `${USGS_BASE_URL}?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=${minMagnitude}&limit=${limit}&orderby=time`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch recent earthquakes');
  }

  return response.json();
};

export const getTimeRange = (hours: number): { startTime: string; endTime: string } => {
  const now = new Date();
  const start = new Date(now.getTime() - hours * 60 * 60 * 1000);

  return {
    startTime: start.toISOString().split('.')[0],
    endTime: now.toISOString().split('.')[0],
  };
};
