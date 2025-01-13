"use client";
import { Search, Binoculars, GraduationCap, Timer, Ticket } from "lucide-react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import { SearchBar, StyledToggleButtonGroup } from "./styled-components";
import { FilterType } from "./types";

type SearchFiltersProps = {
  filterType: FilterType;
  onFilterChange: (event: React.MouseEvent<HTMLElement>, newFilters: FilterType) => void;
};

export const SearchFilters = ({ filterType, onFilterChange }: SearchFiltersProps) => (
  <Box sx={{ 
    position: "absolute", 
    top: theme => theme.spacing(2),
    left: theme => theme.spacing(2),
    right: theme => theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme => theme.spacing(2),
    zIndex: 1,
  }}>
    <SearchBar
      placeholder="   Find Your Next Adventure..."
      InputProps={{
        startAdornment: <Search size={22} />,
      }}
      sx={{
        width: { xs: "85%", md: "95%" },
        alignSelf: "flex-start",
      }}
    />
    
    <StyledToggleButtonGroup
      value={filterType}
      onChange={onFilterChange}
      fullWidth
      size="small"
    >
      <ToggleButton value="tours">
        <Binoculars size={14} />
        <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
          Tours
        </Box>
      </ToggleButton>
      <ToggleButton value="lessons">
        <GraduationCap size={14} />
        <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
          Lessons
        </Box>
      </ToggleButton>
      <ToggleButton value="rentals">
        <Timer size={14} />
        <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
          Rentals
        </Box>
      </ToggleButton>
      <ToggleButton value="tickets">
        <Ticket size={14} />
        <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
          Tickets
        </Box>
      </ToggleButton>
    </StyledToggleButtonGroup>
  </Box>
);