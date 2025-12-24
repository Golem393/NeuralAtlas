import { useState } from 'react';
import { MapView } from './MapView';
import { LayerToggle } from './LayerToggle';
import { StyleSelector } from './StyleSelector';
import { Button } from '@/components/ui/Button';

export const MapPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative w-full h-screen">
      <MapView />
      
      {sidebarOpen && (
        <div className="absolute top-[10px] left-[10px] w-[300px] bg-white p-[15px] rounded-[5px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
          <Button 
            onClick={() => setSidebarOpen(false)}
            className="mb-[10px]"
          >
            Close
          </Button>
          
          <div className="flex flex-col gap-[20px]">
            <LayerToggle />
            <StyleSelector />
          </div>
        </div>
      )}

      {!sidebarOpen && (
        <Button
          onClick={() => setSidebarOpen(true)}
          variant="outline"
          className="absolute top-[10px] left-[10px] py-[10px] px-[15px]"
        >
          Menu
        </Button>
      )}
    </div>
  );
};