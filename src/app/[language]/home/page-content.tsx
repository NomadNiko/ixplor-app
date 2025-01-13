"use client";
import { useState, type CSSProperties } from "react";
import Map, { NavigationControl, GeolocateControl } from "react-map-gl";
import { styled, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Earth,
  Star,
  CalendarDays,
  User,
  Search,
  Timer,
  Ticket,
  Binoculars,
  GraduationCap,
} from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type FilterType = "tours" | "lessons" | "rentals" | "tickets";

const NavButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.glass,
  backdropFilter: "blur(10px)",
  "&:hover": {
    backgroundColor: theme.palette.background.glassHover,
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.glass,
    backdropFilter: "blur(10px)",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.background.glass,
  backdropFilter: "blur(10px)",
  "& .MuiToggleButton-root": {
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const MapHomeLayout = () => {
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.006,
    zoom: 12,
  });

  const [filterType, setFilterType] = useState<FilterType>("tours");

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterType: FilterType | null
  ) => {
    if (newFilterType !== null) {
      setFilterType(newFilterType);
    }
  };

  const theme = useTheme();

  const controlStyle: CSSProperties = {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.glass,
    backdropFilter: "blur(10px)",
    borderRadius: theme.shape.borderRadius,
  };

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
      >
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
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              color: "primary.main",
              zIndex: 1,
            }}
          >
            <GeolocateControl style={controlStyle} />
            <NavigationControl style={controlStyle} />
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: theme.spacing(2),
              left: theme.spacing(2),
              right: theme.spacing(2),
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(2),
              zIndex: 1,
            }}
          >
            <SearchBar
              fullWidth
              placeholder="   Find adventures near you..."
              InputProps={{
                startAdornment: <Search size={20} />,
              }}
            />

            <StyledToggleButtonGroup
              value={filterType}
              exclusive
              onChange={handleFilterChange}
              fullWidth
              size="small"
            >
              <ToggleButton value="tours">
                <Binoculars size={16} />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.85rem" }}>
                  Tours
                </Box>
              </ToggleButton>
              <ToggleButton value="lessons">
                <GraduationCap size={16} />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.85rem" }}>
                  Lessons
                </Box>
              </ToggleButton>
              <ToggleButton value="rentals">
                <Timer size={16} />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.85rem" }}>
                  Rentals
                </Box>
              </ToggleButton>
              <ToggleButton value="tickets">
                <Ticket size={16} />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.85rem" }}>
                  Tickets
                </Box>
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Box>

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
                md: theme.spacing(2),
              },
              backgroundColor: theme.palette.background.glass,
              backdropFilter: "blur(10px)",
              borderRadius: { xs: 0, md: 2 },
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
                height: theme.spacing(7.5),
                pb: { xs: "env(safe-area-inset-bottom)", md: 0 },
              }}
            >
              <NavButton>
                <Earth />
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
