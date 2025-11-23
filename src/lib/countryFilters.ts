import type { CountryFilter, EarthquakeFeature } from '@/types/earthquake';

export const countryFilters: CountryFilter[] = [
  { label: 'All Countries', value: 'all', keywords: [] },
  {
    label: 'United States',
    value: 'us',
    keywords: ['United States', 'U.S.', 'USA', 'Alaska', 'California', 'Hawaii', 'Nevada', 'Washington', 'Oregon', 'Montana', 'Wyoming', 'Idaho', 'Utah']
  },
  {
    label: 'Japan',
    value: 'jp',
    keywords: ['Japan', 'Japanese', 'Honshu', 'Hokkaido', 'Kyushu', 'Shikoku']
  },
  {
    label: 'Indonesia',
    value: 'id',
    keywords: ['Indonesia', 'Indonesian', 'Java', 'Sumatra', 'Sulawesi', 'Bali']
  },
  {
    label: 'Chile',
    value: 'cl',
    keywords: ['Chile', 'Chilean']
  },
  {
    label: 'Mexico',
    value: 'mx',
    keywords: ['Mexico', 'Mexican', 'Baja California']
  },
  {
    label: 'Philippines',
    value: 'ph',
    keywords: ['Philippines', 'Philippine', 'Luzon', 'Mindanao', 'Visayas']
  },
  {
    label: 'New Zealand',
    value: 'nz',
    keywords: ['New Zealand', 'NZ', 'North Island', 'South Island', 'Kermadec Islands']
  },
  {
    label: 'Turkey',
    value: 'tr',
    keywords: ['Turkey', 'Turkish', 'Türkiye']
  },
  {
    label: 'Iran',
    value: 'ir',
    keywords: ['Iran', 'Iranian']
  },
  {
    label: 'Bangladesh',
    value: 'bd',
    keywords: ['Bangladesh', 'Bangladeshi']
  },
  {
    label: 'Peru',
    value: 'pe',
    keywords: ['Peru', 'Peruvian']
  },
  {
    label: 'China',
    value: 'cn',
    keywords: ['China', 'Chinese', 'Tibet', 'Sichuan', 'Yunnan', 'Xinjiang']
  },
  {
    label: 'Papua New Guinea',
    value: 'pg',
    keywords: ['Papua New Guinea', 'PNG', 'New Britain', 'New Ireland']
  },
  {
    label: 'Italy',
    value: 'it',
    keywords: ['Italy', 'Italian', 'Sicily']
  },
  {
    label: 'Greece',
    value: 'gr',
    keywords: ['Greece', 'Greek', 'Crete']
  },
  {
    label: 'Ecuador',
    value: 'ec',
    keywords: ['Ecuador', 'Ecuadorian']
  },
  {
    label: 'Pacific Ocean Regions',
    value: 'pacific',
    keywords: ['Pacific', 'Fiji', 'Tonga', 'Vanuatu', 'Solomon Islands', 'Samoa']
  },
  {
    label: 'Central America',
    value: 'central-america',
    keywords: ['Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama']
  },
];

export const filterEarthquakesByCountry = (
  earthquakes: EarthquakeFeature[],
  countryFilter: CountryFilter
): EarthquakeFeature[] => {
  if (countryFilter.value === 'all' || countryFilter.keywords.length === 0) {
    return earthquakes;
  }

  return earthquakes.filter((earthquake) => {
    const place = earthquake.properties.place.toLowerCase();
    return countryFilter.keywords.some((keyword) =>
      place.includes(keyword.toLowerCase())
    );
  });
};
