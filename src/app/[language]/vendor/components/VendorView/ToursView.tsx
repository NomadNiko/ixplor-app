"use client";

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import { TourProduct } from '@/types/vendor-types';
import { StatusChip, StatCard } from './styled/vendor-view-styled';

interface ToursViewProps {
  tours: TourProduct[];
}

export default function ToursView({ tours }: ToursViewProps) {
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
              <Typography variant="body2" color="textSecondary">
                Scheduled Tours
              </Typography>
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
              <Typography variant="body2" color="textSecondary">
                Total Capacity
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Tours List */}
      {tours.map((tour) => (
        <Grid key={tour.id} size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {tour.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {tour.description}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2">Duration: {tour.duration}</Typography>
                <Typography variant="body2">
                  Max Participants: {tour.maxParticipants}
                </Typography>
                <Typography variant="body2" color="primary">
                  ${tour.price}
                </Typography>
              </Stack>

              {tour.schedule && tour.schedule.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Upcoming Schedule
                  </Typography>
                  <Stack spacing={1}>
                    {tour.schedule.map((event) => (
                      <Box
                        key={event.id}
                        display="flex"
                        alignItems="center"
                        gap={2}
                      >
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
}