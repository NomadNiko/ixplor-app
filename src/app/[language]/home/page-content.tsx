"use client";
import { useState, useMemo } from 'react';
import Map, { NavigationControl, GeolocateControl } from 'react-map-gl';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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

const MapHomeLayout = () => {
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.006,
    zoom: 12
  });

  const theme = useTheme();

  // Create a custom style object using useMemo
  const navigationControlStyle = useMemo(() => {
    return {
      "--mapbox-ctrl-icon-opacity": "0.8",
      "--mapbox-ctrl-icon-color": "hsl(0, 0%, 100%)",
      "--mapbox-ctrl-icon-hover-color": "hsl(0, 0%, 75%)",
      "--mapbox-ctrl-group-background": "hsl(210, 21%, 15%)",
      "--mapbox-ctrl-group-border-color": "hsla(0, 0%, 0%, 0.5)",
      "--mapbox-ctrl-group-hover-background": "hsl(210, 21%, 20%)",
    };
  }, []);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%', position: "relative" }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Container for other components to snap to */}
        <Container
          maxWidth="md"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none", // Allow map interactions through the container
            "& > *": { pointerEvents: "auto" } // Re-enable pointer events for children
          }}
        >
          {/* Wrapper for GeolocateControl and NavigationControl */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              pt: 2, // Padding top
              // Adjust positioning for both controls
              position: 'relative',
              left: theme.spacing(2), // Add left spacing
              zIndex: 1, // Ensure controls are above other elements
            }}
          >
            <GeolocateControl
              position="top-left"
              style={{
                top: theme.spacing(10),
                left: 0,
              }}
            />

            <NavigationControl
              position="top-left"
              style={{
                ...navigationControlStyle,
                top: theme.spacing(10),
                left: 0,
              }}
            />
          </Box>

          {/* Search bar container */}
          <Box
            sx={{
              position: "absolute", // Position absolutely within the Container
              top: theme.spacing(2), // Adjust top spacing
              left: theme.spacing(2), // Match container's left spacing
              right: theme.spacing(2), // Match container's right spacing
              display: "flex",
              gap: theme.spacing(1),
              zIndex: 1, // Ensure search bar is above other elements
            }}
          >
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

          {/* Bottom navigation container */}
          <Box
            sx={{
              width: { xs: "100%", md: "100%" },
              position: { xs: "fixed", md: "relative" },
              bottom: { xs: 0, md: theme.spacing(2) },
              left: { xs: 0, md: "auto" },
              right: { xs: 0, md: "auto" },
              padding: theme.spacing(2),
              paddingBottom: {
                xs: `calc(${theme.spacing(2)} + env(safe-area-inset-bottom))`,
                md: theme.spacing(2)
              },
              backgroundColor: "rgba(28, 40, 58, 0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: { xs: 0, md: 2 },
              zIndex: 1, // Ensure bottom bar is above other elements
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
                height: theme.spacing(7.5),
                pb: { xs: "env(safe-area-inset-bottom)", md: 0 }
              }}
            >
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
            </Box>
          </Box>
        </Container>
      </Map>
    </Box>
  );
};

export default MapHomeLayout;