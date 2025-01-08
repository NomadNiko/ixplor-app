// src/app/[language]/vendor/components/vendor-view.tsx

"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import { mockVendorDetails } from "../mock-data";
import Chip  from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface VendorViewProps {
  vendorId: string;
  onBackClick: () => void;
  onEditClick: () => void;
}

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'status'
})<{ status: 'available' | 'booked' | 'cancelled' }>(({ theme, status }) => ({
  backgroundColor: 
    status === 'available' ? theme.palette.success.main :
    status === 'booked' ? theme.palette.warning.main :
    theme.palette.error.main,
  color: theme.palette.common.white
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.default
}));

const renderTourView = (vendor: typeof mockVendorDetails[0]) => {
  const tours = vendor.tours || [];
  return (
    <Grid container spacing={3}>
      {/* Stats Overview */}
      <Grid size={{ xs: 12 }} container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="h6">
                  {tours.reduce((acc, tour) => acc + (tour.schedule?.length || 0), 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">Scheduled Tours</Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <GroupIcon color="primary" />
                <Typography variant="h6">
                  {tours.reduce((acc, tour) => acc + tour.maxParticipants, 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">Total Capacity</Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Tours List */}
      {tours.map((tour) => (
        <Grid key={tour.id} size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{tour.name}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {tour.description}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2">
                  Duration: {tour.duration}
                </Typography>
                <Typography variant="body2">
                  Max Participants: {tour.maxParticipants}
                </Typography>
                <Typography variant="body2" color="primary">
                  ${tour.price}
                </Typography>
              </Stack>
              
              {tour.schedule && tour.schedule.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>Upcoming Schedule</Typography>
                  <Stack spacing={1}>
                    {tour.schedule.map((event) => (
                      <Box key={event.id} display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2">{event.date}</Typography>
                        <Typography variant="body2">
                          {event.startTime} - {event.endTime}
                        </Typography>
                        <StatusChip
                          label={event.status}
                          status={event.status}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const renderTicketView = (vendor: typeof mockVendorDetails[0]) => {
  const tickets = vendor.tickets || [];
  
  return (
    <Grid container spacing={3}>
      {/* Stats Overview */}
      <Grid size={{ xs: 12 }} container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <InventoryIcon color="primary" />
                <Typography variant="h6">
                  {tickets.reduce((acc, ticket) => acc + ticket.availableCount, 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">Available Tickets</Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoneyIcon color="primary" />
                <Typography variant="h6">
                  {tickets.reduce((acc, ticket) => acc + ticket.soldCount, 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">Tickets Sold</Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Tickets List */}
      {tickets.map((ticket) => (
        <Grid key={ticket.id} size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{ticket.name}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={ticket.type} size="small" />
                <Typography variant="body2" color="primary">
                  ${ticket.price}
                </Typography>
              </Stack>
              
              <Box mt={2}>
                <Stack direction="row" spacing={3}>
                  <Typography variant="body2">
                    Available: {ticket.availableCount}
                  </Typography>
                  <Typography variant="body2">
                    Sold: {ticket.soldCount}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Valid: {ticket.validFrom} to {ticket.validTo}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const renderRentalView = (vendor: typeof mockVendorDetails[0]) => {
  const rentals = vendor.rentals || [];

  return (
    <Grid container spacing={3}>
      {/* Stats Overview */}
      <Grid size={{ xs: 12 }} container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <InventoryIcon color="primary" />
                <Typography variant="h6">
                  {rentals.reduce((acc, rental) => acc + rental.availableUnits, 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">Available Units</Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="h6">
                  {rentals.reduce((acc, rental) => acc + rental.dueIn, 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">Due Returns Today</Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Rentals List */}
      {rentals.map((rental) => (
        <Grid key={rental.id} size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{rental.name}</Typography>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {rental.category}
              </Typography>
              
              <Grid container spacing={2} mt={1}>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="textSecondary">Available</Typography>
                  <Typography variant="h6">{rental.availableUnits}</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="textSecondary">Booked</Typography>
                  <Typography variant="h6">{rental.bookedUnits}</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="textSecondary">Due Out</Typography>
                  <Typography variant="h6">{rental.dueOut}</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="textSecondary">Due In</Typography>
                  <Typography variant="h6">{rental.dueIn}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const renderLessonView = (vendor: typeof mockVendorDetails[0]) => {
  const lessons = vendor.lessons || [];

  return (
    <Grid container spacing={3}>
      {/* Stats Overview */}
      <Grid size={{ xs: 12 }} container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <GroupIcon color="primary" />
                <Typography variant="h6">
                  {lessons.filter(lesson => lesson.status === 'booked').length}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">Booked Lessons</Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="h6">
                  {lessons.filter(lesson => lesson.status === 'requested').length}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">Pending Requests</Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Lessons List */}
      {lessons.map((lesson) => (
        <Grid key={lesson.id} size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{lesson.name}</Typography>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography variant="body2">
                  Instructor: {lesson.instructor}
                </Typography>
                <Typography variant="body2">
                  Duration: {lesson.duration}
                </Typography>
                <Typography variant="body2" color="primary">
                  ${lesson.price}
                </Typography>
              </Stack>
              
              <Box display="flex" alignItems="center" gap={2}>
                <StatusChip
                  label={lesson.status}
                  status={lesson.status as 'available' | 'booked' | 'cancelled'}
                  size="small"
                />
                {lesson.scheduledDate && (
                  <Typography variant="body2" color="textSecondary">
                    Scheduled: {lesson.scheduledDate}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default function VendorView({ vendorId, onBackClick, onEditClick }: VendorViewProps) {
  const { t } = useTranslation("vendor-panel");
  const vendor = mockVendorDetails.find(v => v.id === vendorId);

  if (!vendor) return null;

  const renderContent = () => {
    switch (vendor.type) {
      case "tours":
        return renderTourView(vendor);
      case "tickets":
        return renderTicketView(vendor);
      case "rentals":
        return renderRentalView(vendor);
      case "lessons":
        return renderLessonView(vendor);
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        {/* Header with navigation */}
        <Grid size={{ xs: 12 }} display="flex" alignItems="center" justifyContent="space-between">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackClick}
          >
            {t("actions.back")}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onEditClick}
          >
            {t("actions.edit")}
          </Button>
        </Grid>

        {/* Vendor header information */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4" gutterBottom>{vendor.name}</Typography>
          <Typography variant="body1" paragraph>{vendor.description}</Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Type-specific content */}
        <Grid size={{ xs: 12 }}>
          {renderContent()}
        </Grid>
      </Grid>
    </Container>
  );
}