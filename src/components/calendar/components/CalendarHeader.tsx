import Box from "@mui/material/Box";
import Typography  from "@mui/material/Typography";
import IconButton  from "@mui/material/IconButton";
import ButtonGroup  from "@mui/material/ButtonGroup";
import Button  from "@mui/material/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { CalendarView } from "../types";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onNavigate: (direction: "prev" | "next") => void;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onNavigate,
  onViewChange,
}: CalendarHeaderProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => onNavigate("prev")}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">
          {format(
            currentDate,
            view === "day"
              ? "MMM d, yyyy"
              : view === "week"
              ? "'Week of' MMM d, yyyy"
              : "MMMM yyyy"
          )}
        </Typography>
        <IconButton onClick={() => onNavigate("next")}>
          <ChevronRight />
        </IconButton>
      </Box>
      <ButtonGroup>
        {(["day", "week", "month"] as const).map((viewOption) => (
          <Button
            key={viewOption}
            variant={view === viewOption ? "contained" : "outlined"}
            onClick={() => onViewChange(viewOption)}
          >
            {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}
