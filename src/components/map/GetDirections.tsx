import React, { useState, useEffect } from "react";
import { Source, Layer, useMap } from "react-map-gl";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { Navigation2, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Feature, LineString } from 'geojson';

interface GetDirectionsProps {
  destination: {
    longitude: number;
    latitude: number;
  };
  onClose?: () => void;
}

interface RouteFeature extends Feature {
  geometry: LineString;
  properties: {};
}

interface DirectionStep {
  maneuver: {
    instruction: string;
    type: string;
  };
  distance: number;
  duration: number;
}

const GetDirections: React.FC<GetDirectionsProps> = ({
  destination,
  onClose,
}) => {
  const theme = useTheme();
  const { current: map } = useMap();
  const [route, setRoute] = useState<RouteFeature | null>(null);
  const [steps, setSteps] = useState<DirectionStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError("Could not get your location. Please enable location services.");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fitRouteInView = (routeGeometry: LineString) => {
    if (!map) return;
    const coordinates = routeGeometry.coordinates;
    const bounds = coordinates.reduce(
      (box, coord) => {
        return {
          minLng: Math.min(box.minLng, coord[0]),
          maxLng: Math.max(box.maxLng, coord[0]),
          minLat: Math.min(box.minLat, coord[1]),
          maxLat: Math.max(box.maxLat, coord[1]),
        };
      },
      {
        minLng: Infinity,
        maxLng: -Infinity,
        minLat: Infinity,
        maxLat: -Infinity,
      }
    );

    const lngPadding = (bounds.maxLng - bounds.minLng) * 0.1;
    const latPadding = (bounds.maxLat - bounds.minLat) * 0.1;
    const bottomPadding = window.innerHeight * 0.25;

    map.fitBounds(
      [
        [bounds.minLng - lngPadding, bounds.minLat - latPadding],
        [bounds.maxLng + lngPadding, bounds.maxLat + latPadding],
      ],
      {
        padding: { top: 50, bottom: bottomPadding, left: 50, right: 50 },
        duration: 1000,
      }
    );
  };

  useEffect(() => {
    const getDirections = async () => {
      if (!userLocation) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/` +
          `${userLocation.longitude},${userLocation.latitude};` +
          `${destination.longitude},${destination.latitude}` +
          `?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
        );

        if (!response.ok) throw new Error("Failed to fetch directions");
        
        const data = await response.json();
        
        if (!data.routes || !data.routes[0]) {
          throw new Error("No route found");
        }

        const routeGeoJSON: RouteFeature = {
          type: "Feature",
          properties: {},
          geometry: data.routes[0].geometry
        };

        setRoute(routeGeoJSON);
        setSteps(data.routes[0].legs[0].steps);
        fitRouteInView(data.routes[0].geometry);
      } catch (error) {
        setError("Could not calculate directions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      getDirections();
    }
  }, [userLocation, destination]);

  const formatDistance = (meters: number) => {
    const miles = meters * 0.000621371;
    return miles < 0.1 
      ? `${Math.round(meters)} ft`
      : `${miles.toFixed(1)} mi`;
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: theme.spacing(10), md: theme.spacing(12.5) },
          left: { xs: 0, md: '50%' },
          right: { xs: 0, md: 'auto' },
          height: "30%",
          width: { xs: '100%', sm: '600px' },
          transform: { xs: 'none', md: 'translateX(-50%)' },
          bgcolor: "background.glass",
          backdropFilter: "blur(10px)",
          borderRadius: { xs: "12px 12px 0 0", md: 2 },
          border: "1px solid",
          borderColor: "divider",
          zIndex: 75,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Navigation2 size={20} />
            <Typography variant="h6">Directions</Typography>
          </Box>
          {onClose && (
            <IconButton onClick={onClose} size="small">
              <X size={20} />
            </IconButton>
          )}
        </Box>

        <Box sx={{ 
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          px: 2
        }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error" sx={{ p: 2 }}>
              {error}
            </Typography>
          ) : steps.length > 0 ? (
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                gap: 2
              }}>
                <IconButton 
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  sx={{ 
                    visibility: currentStepIndex === 0 ? 'hidden' : 'visible',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ChevronLeft />
                </IconButton>

                <Box sx={{ 
                  flex: 1,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Typography variant="body1">
                    {steps[currentStepIndex].maneuver.instruction}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistance(steps[currentStepIndex].distance)}
                  </Typography>
                </Box>

                <IconButton 
                  onClick={handleNextStep}
                  disabled={currentStepIndex === steps.length - 1}
                  sx={{ 
                    visibility: currentStepIndex === steps.length - 1 ? 'hidden' : 'visible',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>

              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute',
                  bottom: 8,
                  color: 'text.secondary'
                }}
              >
                Step {currentStepIndex + 1} of {steps.length}
              </Typography>
            </>
          ) : null}
        </Box>
      </Box>
      
      {route && (
        <Source type="geojson" data={route}>
          <Layer
            id="route"
            type="line"
            paint={{
              "line-color": theme.palette.primary.main,
              "line-width": 4,
              "line-opacity": 0.8,
            }}
          />
        </Source>
      )}
    </>
  );
};

export default GetDirections;