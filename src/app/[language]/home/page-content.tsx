"use client";
import { useState, type CSSProperties } from "react";
import Map, { GeolocateControl } from "react-map-gl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import { SearchFilters } from "@/components/map/search-filters";
import { BottomNav } from "@/components/map/bottom-nav";
import { VendorMarker, VendorShortView, VendorFullView } from "@/components/vendor/vendor-display";
import vendorLocations, { VendorLocation } from "@/components/mock-data/vendor-location";
import { FilterType } from "@/components/map/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapHomeLayout = () => {
  const [viewState, setViewState] = useState({
    latitude: 21.2850,
    longitude: -157.8356,
    zoom: 14,
  });
  const [selectedVendor, setSelectedVendor] = useState<VendorLocation | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>([]); // Initialize with empty array
  
  const theme = useTheme();
  
  const controlStyle: CSSProperties = {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.glass,
    backdropFilter: "blur(10px)",
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  };

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilterTypes: FilterType) => {
    setFilterType(newFilterTypes);
  };

  // Show all vendors if no filters are selected
  const filteredVendors = vendorLocations.features.filter(
    vendor => filterType.length === 0 || filterType.includes(vendor.properties.vendorType)
  );

  return (
    <Box sx={{ height: "calc(100vh - 64px)", width: "100%", position: "relative" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        <GeolocateControl position="top-right" style={controlStyle} />
        
        {filteredVendors.map((vendor) => (
          <VendorMarker
            key={vendor.properties.businessName}
            vendor={vendor}
            onClick={() => {
              setSelectedVendor(vendor);
              setShowFullView(false);
            }}
          />
        ))}

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