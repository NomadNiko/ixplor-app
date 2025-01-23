"use client";
import { useState, useRef, useEffect } from "react";
import Map, { MapRef, GeolocateControl, ViewState } from "react-map-gl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import { useGetVendorsService } from "@/services/api/services/vendors";
import { Vendor, VendorTypes } from "@/app/[language]/types/vendor";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { BBox } from "geojson";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useTranslation } from "@/services/i18n/client";
import { SearchControls } from "./components/search-controls";
import { VendorTypeFilters } from "./components/vendor-type-filters";
import { VendorViews } from "./components/vendor-views";
import { BottomNav } from "@/components/map/bottom-nav";
import { ClusteredVendorMarkers } from "@/components/vendor/clustered-vendor-markers";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_VIEW_STATE: ViewState = {
  latitude: 21.277,
  longitude: -157.826,
  zoom: 14,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const MapHomeLayout = () => {
  const { t } = useTranslation("home");
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const mapRef = useRef<MapRef>(null);
  const getVendors = useGetVendorsService();

  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [filterTypes, setFilterTypes] = useState<VendorTypes[]>([]);
  const [bounds, setBounds] = useState<BBox | undefined>();

  const controlStyle = {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.glass,
    backdropFilter: "blur(10px)",
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await getVendors();
        if (response.status === HTTP_CODES_ENUM.OK && response.data) {
          setVendors(response.data.data);
        } else {
          enqueueSnackbar(t("errors.failedToLoadVendors"), { variant: "error" });
        }
      } catch (error) {
        enqueueSnackbar(t("errors.failedToLoadVendors"), { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [getVendors, enqueueSnackbar, t]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setViewState({
          ...DEFAULT_VIEW_STATE,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  const handleVendorSelect = (vendor: Vendor, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedVendor(vendor);
    setShowFullView(false);
  };
  
  const updateBounds = () => {
    const map = mapRef.current?.getMap();
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        setBounds([
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ]);
      }
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      filterTypes.length === 0 ||
      vendor.vendorTypes.some((type) => filterTypes.includes(type))
  );
  useEffect(() => {
    if (vendors.length > 0) {
      // Preload by briefly showing and hiding the component
      setSelectedVendor(vendors[0]);
      setTimeout(() => setSelectedVendor(null), 100);
    }
  }, [vendors]);

  if (loading) {
    return (
      <Box sx={{
        height: "calc(100vh - 64px)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
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
        maxZoom={20}
        minZoom={3}
      >
        <GeolocateControl
          position="top-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserHeading
          style={controlStyle}
        />
        <ClusteredVendorMarkers
          vendors={filteredVendors}
          onClick={handleVendorSelect}
          bounds={bounds}
          zoom={viewState.zoom}
        />
        <Container
          maxWidth="md"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
            "& > *": { pointerEvents: "auto" },
          }}
        >
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <SearchControls
              vendors={vendors}
              viewState={viewState}
              setViewState={setViewState}
            />
            <VendorTypeFilters
              filterTypes={filterTypes}
              setFilterTypes={setFilterTypes}
            />
          </Box>
          <BottomNav />
        </Container>
      </Map>
      <VendorViews
        selectedVendor={selectedVendor}
        showFullView={showFullView}
        onViewMore={() => setShowFullView(true)}
        onClose={() => {
          setShowFullView(false);
          setSelectedVendor(null);
        }}
      />
    </Box>
  );
};

export default MapHomeLayout;