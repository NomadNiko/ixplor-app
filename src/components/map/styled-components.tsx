"use client";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export const NavButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light,
  backgroundColor: theme.palette.background.glass,
  backdropFilter: "blur(10px)",
  "&:hover": {
    backgroundColor: theme.palette.background.glassHover,
  },
}));

export const SearchBar = styled(TextField)(({ theme }) => ({
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

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
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