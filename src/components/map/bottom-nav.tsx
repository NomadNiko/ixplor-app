import { Earth, Star, CalendarDays, User } from "lucide-react";
import Box from "@mui/material/Box";
import { NavButton } from "./styled-components";

export const BottomNav = () => (
  <Box
    sx={{
      width: "100",
      position: "fixed",
      bottom: { xs: 0, md: 10 },
      left: 0,
      right: 0,
      padding: (theme) => theme.spacing(2),
      backgroundColor: (theme) => theme.palette.background.glass,
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
        height: (theme) => theme.spacing(5),
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
);
