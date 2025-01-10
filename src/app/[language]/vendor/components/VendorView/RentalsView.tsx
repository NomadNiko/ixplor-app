"use client";

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { RentalProduct } from '@/types/vendor-types';
import { StatCard } from './styled/vendor-view-styled';

interface RentalsViewProps {
  rentals: RentalProduct[];
}

export default function RentalsView({ rentals }: RentalsViewProps) {
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
              <Typography variant="body2" color="textSecondary">
                Available Units
              </Typography>
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
              <Typography variant="body2" color="textSecondary">
                Due Returns Today
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Rentals List */}
      {rentals.map((rental) => (
        <Grid key={rental.id} size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {rental.name}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {rental.category}
              </Typography>

              <Grid container spacing={2} mt={1}>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Available
                  </Typography>
                  <Typography variant="h6">{rental.availableUnits}</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Booked
                  </Typography>
                  <Typography variant="h6">{rental.bookedUnits}</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Due Out
                  </Typography>
                  <Typography variant="h6">{rental.dueOut}</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Due In
                  </Typography>
                  <Typography variant="h6">{rental.dueIn}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}