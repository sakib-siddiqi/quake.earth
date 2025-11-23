import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { TimeFilter } from '@/types/earthquake';

interface FiltersProps {
  selectedTime: TimeFilter;
  onTimeChange: (filter: TimeFilter) => void;
  minMagnitude: number;
  onMagnitudeChange: (magnitude: number) => void;
}

export const timeFilters: TimeFilter[] = [
  { label: '1 Hour', value: '1h', hours: 1 },
  { label: '24 Hours', value: '24h', hours: 24 },
  { label: '7 Days', value: '7d', hours: 168 },
  { label: '30 Days', value: '30d', hours: 720 },
];

export function Filters({
  selectedTime,
  onTimeChange,
  minMagnitude,
  onMagnitudeChange,
}: FiltersProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter earthquakes by time and magnitude</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Time Window</label>
          <Tabs
            value={selectedTime.value}
            onValueChange={(value) => {
              const filter = timeFilters.find((f) => f.value === value);
              if (filter) onTimeChange(filter);
            }}
          >
            <TabsList className="grid w-full grid-cols-4">
              {timeFilters.map((filter) => (
                <TabsTrigger key={filter.value} value={filter.value}>
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Minimum Magnitude</label>
            <span className="text-sm font-bold text-primary">{minMagnitude.toFixed(1)}</span>
          </div>
          <Slider
            value={[minMagnitude]}
            onValueChange={(values) => onMagnitudeChange(values[0])}
            min={0}
            max={9}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.0</span>
            <span>9.0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
