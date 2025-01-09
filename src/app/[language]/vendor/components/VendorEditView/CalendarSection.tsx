// src/app/[language]/vendor/components/VendorEditView/CalendarSection.tsx

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Clock, Users, DollarSign, X, Calendar } from 'lucide-react';
import { VendorProfileDetails } from '@/types/vendor-types';

interface CalendarSectionProps {
  vendor: VendorProfileDetails;
}

export function CalendarSection({ vendor }: CalendarSectionProps) {
  const [selectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Get all events across all products
  const getEvents = () => {
    if (vendor.tours) {
      return vendor.tours.flatMap(tour => 
        tour.schedule.map(event => ({
          ...event,
          productName: tour.name,
          price: tour.price
        }))
      );
    }
    return [];
  };

  const events = getEvents();
  const todaysEvents = events.filter(event => event.date === selectedDate);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          {/* Calendar Grid */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Scheduled Events</Typography>
              {todaysEvents.map((event) => (
                <Card key={event.id} sx={{ mb: 2, p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1">{event.productName}</Typography>
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Clock size={16} />
                          <Typography variant="body2">
                            {event.startTime} - {event.endTime}
                          </Typography>
                        </Box>
                        <Chip 
                          label={event.status} 
                          color={event.status === 'available' ? 'success' : 
                                event.status === 'booked' ? 'primary' : 'error'} 
                          size="small" 
                        />
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <X size={16} />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Calendar />}
                sx={{ mb: 2 }}
              >
                Add New Event
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Users />}
                sx={{ mb: 2 }}
              >
                Manage Capacity
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<DollarSign />}
              >
                Update Pricing
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}