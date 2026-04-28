import { Card } from './ui/card';
import { MapPin } from 'lucide-react';

interface MapLocation {
  id: string;
  title: string;
  coordinates: { lat: number; lng: number };
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface MapViewProps {
  locations: MapLocation[];
  onLocationClick?: (id: string) => void;
}

export default function MapView({ locations, onLocationClick }: MapViewProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Needs Map</h3>
      
      {/* Mock map - in real app would use Leaflet/MapBox */}
      <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-80 overflow-hidden">
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300" />
            ))}
          </div>
        </div>

        {/* Location markers */}
        {locations.slice(0, 5).map((location, index) => (
          <div
            key={location.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 2) * 20}%`,
            }}
            onClick={() => onLocationClick?.(location.id)}
          >
            <div className={`w-8 h-8 ${getPriorityColor(location.priority)} rounded-full flex items-center justify-center shadow-lg`}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="mt-1 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
              {location.title}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-sm text-gray-600">Urgent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span className="text-sm text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-sm text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600">Low</span>
        </div>
      </div>
    </Card>
  );
}
