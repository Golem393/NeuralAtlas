import { useState } from 'react';
import { MapView } from './MapView';
import { LayerToggle } from './LayerToggle';
import { StyleSelector } from './StyleSelector';
import { LocationSelector } from './LocationSelector';
import { Menu, ChevronLeft } from 'lucide-react';

export const MapPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map Background */}
      <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
        <MapView />
      </div>

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${
          sidebarOpen ? 'w-80' : 'w-0'
        }`}
      >
        <div
          className={`h-full p-4 flex flex-col gap-4 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 glass glass-hover rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Layers & Styles */}
          <div className="glass rounded-xl p-3 animate-fade-in space-y-4">
            <LocationSelector />
            <div className="h-px bg-border" />
            <LayerToggle />
            <div className="h-px bg-border" />
            <StyleSelector />
          </div>
        </div>
      </div>

      {/* Toggle Sidebar Button (when closed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 p-3 glass glass-hover rounded-xl animate-fade-in"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      )}
    </div>
  );
};
