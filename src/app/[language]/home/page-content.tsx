import { useState } from 'react';
import { Globe, Star, CalendarDays, User, Search } from 'lucide-react';
import TextField from '@mui/material/TextField';

const MapHomeLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen w-full flex flex-col relative bg-slate-900">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for activities..."
          variant="outlined"
          InputProps={{
            startAdornment: <Search className="mr-2 text-gray-400" size={20} />,
            className: "bg-slate-800/90 backdrop-blur-sm rounded-lg text-white",
          }}
        />
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-slate-800">
        {/* Map will be integrated here */}
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Map Integration Coming Soon
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-800/90 backdrop-blur-sm p-4 flex justify-around items-center">
        <button className="flex flex-col items-center text-blue-500">
          <Globe size={24} />
          <span className="text-xs mt-1">Map</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <Star size={24} />
          <span className="text-xs mt-1">Favorites</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <CalendarDays size={24} />
          <span className="text-xs mt-1">Booked</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MapHomeLayout;