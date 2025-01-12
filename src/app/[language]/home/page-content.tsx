"use client";
import { useState } from 'react';
import Map, { NavigationControl, GeolocateControl } from 'react-map-gl';
import { Input, Button } from '@nextui-org/react';
import { MapPin, Star, CalendarDays, User, Search, ChevronLeft } from 'lucide-react';

// You'll need to get a Mapbox token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapHomeLayout = () => {
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 12
  });

  return (
    <div className="h-screen w-full flex flex-col relative bg-slate-900">
      {/* Map Layer */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        className="w-full h-full"
      >
        <GeolocateControl position="top-right" />
        <NavigationControl position="top-right" />
      </Map>

      {/* Search Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex gap-2">
          <Button isIconOnly color="default" className="bg-slate-800/80 backdrop-blur-md">
            <ChevronLeft />
          </Button>
          <Input
            classNames={{
              input: "text-white",
              base: "bg-slate-800/80 backdrop-blur-md",
            }}
            placeholder="Find adventures near you..."
            startContent={<Search className="text-default-400" size={20} />}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 mx-auto max-w-md flex justify-around">
          <Button 
            isIconOnly 
            variant="light" 
            className="text-blue-500"
            startContent={<MapPin size={24} />}
          />
          <Button 
            isIconOnly 
            variant="light" 
            className="text-default-400"
            startContent={<Star size={24} />}
          />
          <Button 
            isIconOnly 
            variant="light" 
            className="text-default-400"
            startContent={<CalendarDays size={24} />}
          />
          <Button 
            isIconOnly 
            variant="light" 
            className="text-default-400"
            startContent={<User size={24} />}
          />
        </div>
      </div>
    </div>
  );
};

export default MapHomeLayout;