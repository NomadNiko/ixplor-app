import React, { useState, useEffect } from "react";
import { Source, Layer } from "react-map-gl";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Navigation2, X, ArrowRight } from "lucide-react";
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
  const [route, setRoute] = useState<RouteFeature | null>(null);
  const [steps, setSteps] = useState<DirectionStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: theme.spacing(10), md: theme.spacing(12.5) },
          left: { xs: 0, md: '50%' },
          right: { xs: 0, md: 'auto' },
          height: "20%",
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

        <Box sx={{ flex: 1, overflow: "auto", p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 2 }}>
              {error}
            </Typography>
          ) : (
            <List>
              {steps.map((step, index) => (
                <ListItem key={index} sx={{ py: 2 }}>
                  <ListItemIcon>
                    <ArrowRight size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={step.maneuver.instruction}
                    secondary={formatDistance(step.distance)}
                  />
                </ListItem>
              ))}
            </List>
          )}
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