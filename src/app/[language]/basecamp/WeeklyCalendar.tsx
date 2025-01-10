"use client";
import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { mockVendorDetails } from "../vendor/mock-data";
import { useRouter } from "next/navigation";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "tour" | "lesson" | "rental" | "ticket";
  status: string;
  vendorName: string;
}

function WeeklyCalendar() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const router = useRouter();

  // Generate calendar days
  const days = useMemo(
    () => Array.from({ length: 4 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Aggregate all events from different vendor types
  const events = useMemo(() => {
    const allEvents: CalendarEvent[] = [];

    mockVendorDetails.forEach((vendor) => {
      // Add tour events
      if (vendor.tours) {
        vendor.tours.forEach((tour) => {
          tour.schedule.forEach((event) => {
            allEvents.push({
              id: `tour-${event.id}`,
              title: tour.name,
              time: `${event.startTime} - ${event.endTime}`,
              type: "tour",
              status: event.status,
              vendorName: vendor.name,
            });
          });
        });
      }

      // Add lesson events
      if (vendor.lessons) {
        vendor.lessons.forEach((lesson) => {
          if (lesson.scheduledDate) {
            allEvents.push({
              id: `lesson-${lesson.id}`,
              title: lesson.name,
              time: lesson.duration,
              type: "lesson",
              status: lesson.status,
              vendorName: vendor.name,
            });
          }
        });
      }

      // Add rental events
      if (vendor.rentals) {
        vendor.rentals.forEach((rental) => {
          if (rental.dueIn > 0) {
            allEvents.push({
              id: `rental-in-${rental.id}`,
              title: `${rental.name} Return`,
              time: "Due Today",
              type: "rental",
              status: "due-in",
              vendorName: vendor.name,
            });
          }
          if (rental.dueOut > 0) {
            allEvents.push({
              id: `rental-out-${rental.id}`,
              title: `${rental.name} Pickup`,
              time: "Pickup Today",
              type: "rental",
              status: "due-out",
              vendorName: vendor.name,
            });
          }
        });
      }
    });

    return allEvents;
  }, []);

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      console.log(event);
      // In a real app, we'd do proper date comparison
      // For now, randomly distribute events across the week
      console.log(date);
      return Math.random() > 0.7;
    });
  };

  const nextWeek = () => setWeekStart((date) => addDays(date, 4));
  const prevWeek = () => setWeekStart((date) => addDays(date, -4));

  const getEventColor = (type: string) => {
    switch (type) {
      case "tour":
        return "primary.main";
      case "lesson":
        return "success.main";
      case "rental":
        return "warning.main";
      case "ticket":
        return "info.main";
      default:
        return "text.primary";
    }
  };

  return (
    <Box className="mt-8">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
          <Calendar size={24} />
          Scheduled Activities
        </Typography>
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={prevWeek}
            sx={{ padding: (theme) => theme.spacing(3) }}
          >
            <ChevronLeft size={18} />
          </IconButton>
          <Typography variant="subtitle1" component="span" mx={1}>
            {format(weekStart, "MMM d")} -{" "}
            {format(addDays(weekStart, 3), "MMM d, yyyy")}
          </Typography>
          <IconButton
            onClick={nextWeek}
            sx={{ padding: (theme) => theme.spacing(3) }}
          >
            <ChevronRight size={18} />
          </IconButton>
        </Box>
      </Box>

      <Box
        display="flex"
        gap={2}
        sx={{
          overflowX: "auto",
          flexWrap: "nowrap",
          "-webkit-overflow-scrolling": "touch",
        }}
      >
        {days.map((day) => (
          <Card
            key={day.toISOString()}
            className="p-3"
            sx={{
              minWidth: "250px",
              flex: "0 0 auto",
              backgroundColor: isSameDay(day, new Date())
                ? "action.hover"
                : "background.paper",
            }}
          >
            <Typography variant="subtitle2" gutterBottom align="center">
              {format(day, "EEE")}
            </Typography>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              color={
                isSameDay(day, new Date()) ? "primary.main" : "text.primary"
              }
            >
              {format(day, "d")}
            </Typography>

            <Box>
              {getEventsForDay(day).map((event) => (
                <Card
                  key={event.id}
                  variant="outlined"
                  className="mb-2 p-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/vendor`)}
                >
                  <Typography
                    variant="caption"
                    color={getEventColor(event.type)}
                  >
                    {event.type.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {event.title}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption" color="text.secondary">
                      {event.time}
                    </Typography>
                    <Chip
                      label={event.status}
                      size="small"
                      color={
                        event.status === "available"
                          ? "success"
                          : event.status === "booked"
                          ? "primary"
                          : "warning"
                      }
                    />
                  </Box>
                </Card>
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default WeeklyCalendar;
