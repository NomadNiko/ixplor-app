"use client";
import { useState, useRef, type CSSProperties } from "react";
import Map, { MapRef, NavigationControl } from "react-map-gl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import { SearchFilters } from "@/components/map/search-filters";
import { BottomNav } from "@/components/map/bottom-nav";
import { VendorShortView, VendorFullView } from "@/components/vendor/vendor-display";
import { ClusteredVendorMarkers } from "@/components/vendor/clustered-vendor-markers";
import vendorLocations, { VendorLocation } from "@/components/mock-data/vendor-location";
import { FilterType } from "@/components/map/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapHomeLayout = () => {
  const [viewState, setViewState] = useState({
    latitude: 21.277,
    longitude: -157.826,
    zoom: 14,
  });
  const [selectedVendor, setSelectedVendor] = useState<VendorLocation | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>([]);
  const [bounds, setBounds] = useState<[number, number, number, number] | undefined>();
  const mapRef = useRef<MapRef>(null);
  
  const theme = useTheme();

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilterTypes: FilterType) => {
    setFilterType(newFilterTypes);
  };

  const filteredVendors = vendorLocations.features.filter(
    vendor => filterType.length === 0 || filterType.includes(vendor.properties.vendorType)
  );

  const updateBounds = () => {
    const map = mapRef.current?.getMap();
    const mapBounds = map?.getBounds();
    if (mapBounds) {
      setBounds([
        mapBounds.getWest(),
        mapBounds.getSouth(),
        mapBounds.getEast(),
        mapBounds.getNorth()
      ]);
    }
  };

  // Navigation control styles
  const navControlStyle: CSSProperties = {
    right: theme.spacing(2),
    bottom: theme.spacing(12), // Adjust based on your bottom nav height
    zIndex: 1, // Ensure it's behind other UI elements
  };

  return (
    <Box sx={{ height: "calc(100vh - 64px)", width: "100%", position: "relative" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
        onLoad={updateBounds}
        onMoveEnd={updateBounds}
      >
        <NavigationControl
          position="bottom-right"
          style={navControlStyle}
          showCompass={false}
          visualizePitch={false}
        />
        
        <ClusteredVendorMarkers
          vendors={filteredVendors}
          onClick={(vendor) => {
            setSelectedVendor(vendor);
            setShowFullView(false);
          }}
          bounds={bounds}
          zoom={viewState.zoom}
        />

        {/* Apply global style for navigation control elements */}
        <style>
          {`
            .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon {
              background-color: ${theme.palette.background.glass} !important;
              border-radius: ${theme.shape.borderRadius}px !important;
            }
            .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon {
              background-color: ${theme.palette.background.glass} !important;
              border-radius: ${theme.shape.borderRadius}px !important;
            }
            .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in:hover .mapboxgl-ctrl-icon,
            .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out:hover .mapboxgl-ctrl-icon {
              background-color: ${theme.palette.background.glassHover} !important;
            }
            .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in,
            .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out {
              background-color: transparent !important;
            }
            .mapboxgl-ctrl-group {
              background-color: transparent !important;
              border: none !important;
            }
            .mapboxgl-ctrl-icon {
              filter: invert(46%) sepia(96%) saturate(1396%) hue-rotate(200deg) brightness(100%) contrast(91%) !important;
            }
          `}
        </style>

        <Container maxWidth="md" sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pointerEvents: "none",
          "& > *": { pointerEvents: "auto" },
        }}>
          <SearchFilters 
            filterType={filterType}
            onFilterChange={handleFilterChange}
          />
          <BottomNav />
        </Container>
      </Map>

      {selectedVendor && !showFullView && (
        <VendorShortView
          vendor={selectedVendor}
          onViewMore={() => setShowFullView(true)}
          onClose={() => setSelectedVendor(null)}
        />
      )}
      
      {selectedVendor && showFullView && (
        <VendorFullView
          vendor={selectedVendor}
          onClose={() => setShowFullView(false)}
        />
      )}
    </Box>
  );
};

export default MapHomeLayout;