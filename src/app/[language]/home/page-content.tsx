"use client";
import { useState, useRef, useEffect, CSSProperties } from 'react';
import Map, { MapRef, GeolocateControl, ViewState } from 'react-map-gl';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { SearchFilters } from "@/components/map/search-filters";
import { BottomNav } from "@/components/map/bottom-nav";
import { VendorShortView, VendorFullView } from "@/components/vendor/vendor-display";
import { ClusteredVendorMarkers } from "@/components/vendor/clustered-vendor-markers";
import { useGetVendorsService } from "@/services/api/services/vendors";
import { Vendor, VendorType } from '../types/vendor';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { BBox } from 'geojson';
import { useSnackbar } from '@/hooks/use-snackbar';
import { useTranslation } from '@/services/i18n/client';
import { useTheme } from '@mui/material/styles';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_VIEW_STATE: ViewState = {
  latitude: 21.277,
  longitude: -157.826,
  zoom: 14,
  bearing: 0,
  pitch: 0,
  padding: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
};

const MapHomeLayout = () => {
  const { t } = useTranslation("home");
  const { enqueueSnackbar } = useSnackbar();
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [filterType, setFilterType] = useState<VendorType[]>([]);
  const [bounds, setBounds] = useState<BBox | undefined>();

  const mapRef = useRef<MapRef>(null);
  const getVendors = useGetVendorsService();

   
  const theme = useTheme();

  const controlStyle: CSSProperties = {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.glass,
    backdropFilter: "blur(10px)",
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await getVendors();

        if (response.status === HTTP_CODES_ENUM.OK && response.data) {
          setVendors(response.data.data);
        } else {
          enqueueSnackbar(t('errors.failedToLoadVendors'), { variant: 'error' });
          console.error('Failed to fetch vendors:', response);
        }
      } catch (error) {
        enqueueSnackbar(t('errors.failedToLoadVendors'), { variant: 'error' });
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [getVendors, enqueueSnackbar, t]);

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterTypes: VendorType[]
  ) => {
    setFilterType(newFilterTypes);
  };

  const filteredVendors = vendors.filter(vendor =>
    filterType.length === 0 || filterType.includes(vendor.vendorType)
  );

  const updateBounds = () => {
    const map = mapRef.current?.getMap();
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        setBounds([
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth()
        ]);
      }
    }
  };

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowFullView(false);
    
    // Center map on selected vendor
    if (mapRef.current) {
      setViewState(prev => ({
        ...prev,
        longitude: vendor.location.coordinates[0],
        latitude: vendor.location.coordinates[1],
        zoom: Math.max(prev.zoom, 15) // Ensure we're zoomed in enough
      }));
    }
  };

  const handleGeolocate = () => {
    // Optional: Add any special handling when user location is obtained
    updateBounds();
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
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
        onLoad={updateBounds}
        onMoveEnd={updateBounds}
        maxZoom={20}
        minZoom={3}
      >
        <GeolocateControl 
          position="top-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserHeading
          onGeolocate={handleGeolocate}
          style={controlStyle}
        />
        
        <ClusteredVendorMarkers
          vendors={filteredVendors}
          onClick={handleVendorClick}
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