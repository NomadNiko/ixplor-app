"use client";
import { useState, useRef, useEffect } from 'react';
import Map, { MapRef, GeolocateControl } from 'react-map-gl';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
//import { useTheme } from "@mui/material/styles";
import { SearchFilters } from "@/components/map/search-filters";
import { BottomNav } from "@/components/map/bottom-nav";
import { VendorShortView, VendorFullView } from "@/components/vendor/vendor-display";
import { ClusteredVendorMarkers } from "@/components/vendor/clustered-vendor-markers";
//import { FilterType } from "@/components/map/types";
import { useGetVendorsService } from "@/services/api/services/vendors";
import CircularProgress from "@mui/material/CircularProgress";
import { Vendor, VendorType } from '../types/vendor';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

const MapHomeLayout = () => {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 21.277,
    longitude: -157.826,
    zoom: 14,
  });
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [filterType, setFilterType] = useState<VendorType[]>([]);
  const [bounds, setBounds] = useState<[number, number, number, number] | undefined>();
  
  const mapRef = useRef<MapRef>(null);
  //const theme = useTheme();
  
  const getVendors = useGetVendorsService();
  //const getNearbyVendors = useGetNearbyVendorsService();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await getVendors();
        if (response.status === 200) {
          setVendors(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [getVendors]);

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilterTypes: VendorType[]) => {
    setFilterType(newFilterTypes);
  };

  const filteredVendors = vendors.map(vendor => 
    vendor._doc ? vendor._doc : vendor
  ).filter(
    vendor => filterType.length === 0 || filterType.includes(vendor.vendorType)
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

  if (loading) {
    return (
      <Box 
        sx={{ 
          height: "calc(100vh - 64px)", 
          width: "100%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
        <GeolocateControl position="top-right" />
        
        <ClusteredVendorMarkers
          vendors={filteredVendors}
          onClick={(vendor) => {
            setSelectedVendor(vendor);
            setShowFullView(false);
          }}
          bounds={bounds}
          zoom={viewState.zoom}
        />

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