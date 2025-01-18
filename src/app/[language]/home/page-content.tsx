"use client";
import { useState, useRef, useEffect } from "react";
import Map, { MapRef, GeolocateControl, ViewState } from "react-map-gl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { Search, Store, MapPin, Binoculars, GraduationCap, Timer, Ticket } from "lucide-react";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import { StyledToggleButtonGroup } from "@/components/map/styled-components";
import { BottomNav } from "@/components/map/bottom-nav";
import { VendorShortView, VendorFullView } from "@/components/vendor/vendor-display";
import { ClusteredVendorMarkers } from "@/components/vendor/clustered-vendor-markers";
import { useGetVendorsService } from "@/services/api/services/vendors";
import { Vendor, VendorType } from "@/app/[language]/types/vendor";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { BBox } from "geojson";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useTranslation } from "@/services/i18n/client";
import { useTheme } from "@mui/material/styles";
import { useGooglePlaces } from '@/hooks/use-google-places';

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
    right: 0,
  },
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
  const [searchMode, setSearchMode] = useState<'vendor' | 'map'>('vendor');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Vendor[]>([]);
  const [locationResults, setLocationResults] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mapRef = useRef<MapRef>(null);
  const getVendors = useGetVendorsService();
  const theme = useTheme();
  const { getPlacePredictions, getPlaceDetails } = useGooglePlaces();

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
          console.error("Failed to fetch vendors:", response);
        }
      } catch (error) {
        enqueueSnackbar(t("errors.failedToLoadVendors"), { variant: "error" });
        console.error("Error fetching vendors:", error);
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

  // Handle search mode changes
  const handleSearchModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'vendor' | 'map' | null
  ) => {
    if (newMode) {
      setSearchMode(newMode);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  // Handle vendor search
  useEffect(() => {
    if (searchMode === 'vendor' && searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = vendors.filter(vendor =>
        vendor.businessName.toLowerCase().includes(lowercaseQuery) ||
        vendor.description.toLowerCase().includes(lowercaseQuery)
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchMode, vendors]);

  // Handle location search
  const handleLocationSearch = async (query: string) => {
    if (!query || searchMode !== 'map') return;
    setIsSearching(true);
    try {
      const predictions = await getPlacePredictions(query);
      setLocationResults(predictions);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsSearching(false);
    }
    console.log(isSearching)
  };

  // Debounce location search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchMode === 'map') {
        handleLocationSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchMode]);

  const handleVendorSelect = (vendor: Vendor) => {
    setViewState({
      ...viewState,
      longitude: vendor.location.coordinates[0],
      latitude: vendor.location.coordinates[1],
      zoom: 16
    });
    setSelectedVendor(vendor);
    setShowFullView(false);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleLocationSelect = async (placeId: string) => {
    setIsSearching(true);
    try {
      const details = await getPlaceDetails(placeId);
      if (details) {
        setViewState({
          ...viewState,
          latitude: details.latitude,
          longitude: details.longitude,
          zoom: 16
        });
        setShowResults(false);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterTypes: VendorType[]
  ) => {
    setFilterType(newFilterTypes);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
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
          bounds.getNorth(),
        ]);
      }
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
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ height: "calc(100vh - 64px)", width: "100%", position: "relative" }}
    >
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
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  sx={{
                    width: { xs: "87%", md: "94%" },
                    alignSelf: "flex-start",
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchMode === 'vendor' ? t('searchPlaceholder.vendor') : t('searchPlaceholder.location')}
                  InputProps={{
                    startAdornment: <Search size={20} className="mr-2" />,
                    endAdornment: (
                      <ToggleButtonGroup
                        value={searchMode}
                        exclusive
                        onChange={handleSearchModeChange}
                        size="small"
                      >
                        <ToggleButton value="vendor">
                          <Store size={16} />
                        </ToggleButton>
                        <ToggleButton value="map">
                          <MapPin size={16} />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    ),
                    sx: {
                      backgroundColor: 'background.glass',
                      backdropFilter: 'blur(10px)',
                    }
                  }}
                />
              </Box>

              {showResults && searchQuery && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    mt: 1,
                    maxHeight: '400px',
                    overflow: 'auto',
                    zIndex: 1000,
                    backgroundColor: 'background.glass',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <List>
                    {searchMode === 'vendor' ? (
                      searchResults.length > 0 ? (
                        searchResults.map((vendor) => (
                          <ListItem key={vendor._id} disablePadding>
                            <ListItemButton onClick={() => handleVendorSelect(vendor)}>
                              <ListItemIcon>
                                <Store size={20} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={vendor.businessName}
                                secondary={vendor.description}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary={t("noVendorsFound")} />
                        </ListItem>
                      )
                    ) : (
                      locationResults.map((result) => (
                        <ListItem key={result.place_id} disablePadding>
                          <ListItemButton onClick={() => handleLocationSelect(result.place_id)}>
                            <ListItemIcon>
                              <MapPin size={20} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={result.structured_formatting.main_text}
                              secondary={result.structured_formatting.secondary_text}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))
                    )}
                  </List>
                </Paper>
              )}
            </Box>

            <StyledToggleButtonGroup
              value={filterType}
              onChange={handleFilterChange}
              aria-label="vendor type filters"
              fullWidth
              size="small"
            >
              <ToggleButton value="tours" aria-label="tours">
                <Binoculars size={14} />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
                  {t("filters.tours")}
                </Box>
              </ToggleButton>
              <ToggleButton value="lessons" aria-label="lessons">
                <GraduationCap size={14} />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
                  {t("filters.lessons")}
                </Box>
              </ToggleButton>
              <ToggleButton value="rentals" aria-label="rentals">
                <Timer size={14} />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
                  {t("filters.rentals")}
                </Box>
              </ToggleButton>
              <ToggleButton value="tickets" aria-label="tickets">
                <Ticket size={14} />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
                  {t("filters.tickets")}
                </Box>
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Box>
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