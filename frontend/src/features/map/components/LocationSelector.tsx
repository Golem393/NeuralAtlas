import { MapPin } from 'lucide-react';
import { useMapStore } from '../store';
import { Location } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

export const LocationSelector = () => {
  const { location, setLocation } = useMapStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <MapPin className="w-4 h-4" />
        <span>Location</span>
      </div>
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-full bg-secondary/50 border-border/50">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Location.Munich}>Munich</SelectItem>
          <SelectItem value={Location.Cortina}>Cortina d'Ampezzo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
