"use client";
import { useState } from 'react';
import Map, { NavigationControl, GeolocateControl } from 'react-map-gl';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { MapPin, Star, CalendarDays, User, Search, ChevronLeft } from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Styled components for consistent look
const NavButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: 'rgba(28, 40, 58, 0.8)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(28, 40, 58, 0.9)',
  }
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(28, 40, 58, 0.8)',
    backdropFilter: 'blur(10px)',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const BottomNav = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  padding: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(4),
  backgroundColor: 'rgba(28, 40, 58, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
}));

const MapHomeLayout = () => {
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.006,
    zoom: 12
  });

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%', position: 'relative' }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <GeolocateControl position="top-right" />
        <NavigationControl position="top-right" />
      </Map>

      <Box sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        display: 'flex',
        gap: 1,
      }}>
        <NavButton size="large">
          <ChevronLeft />
        </NavButton>
        <SearchBar
          fullWidth
          placeholder="Find adventures near you..."
          InputProps={{
            startAdornment: <Search className="mr-4 text-gray-400" size={20} />
          }}
        />
      </Box>

      <BottomNav elevation={0}>
        <NavButton>
          <MapPin />
        </NavButton>
        <NavButton>
          <Star />
        </NavButton>
        <NavButton>
          <CalendarDays />
        </NavButton>
        <NavButton>
          <User />
        </NavButton>
      </BottomNav>
    </Box>
  );
};

export default MapHomeLayout;