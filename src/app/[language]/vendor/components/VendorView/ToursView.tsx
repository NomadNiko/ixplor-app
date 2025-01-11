import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import { Calendar, Users, Clock, MapPin, DollarSign, Plus } from 'lucide-react';
import { TourProduct } from '@/types/vendor-types';
import { StatCard } from './styled/vendor-view-styled';

interface ToursViewProps {
  tours: TourProduct[];
  onEditClick?: () => void;
}

export default function ToursView({ tours, onEditClick }: ToursViewProps) {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Calculate statistics
  const totalTours = tours.length;
  const upcomingTours = tours.reduce((acc, tour) => 
    acc + (tour.schedule?.filter(s => new Date(s.date) > new Date()).length || 0), 0);
  const totalCapacity = tours.reduce((acc, tour) => acc + tour.maxParticipants, 0);
  const totalRevenue = tours.reduce((acc, tour) => acc + tour.price, 0);

  return (
    <Box>
      {/* Quick Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={3}>
          <StatCard>
            <Box p={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Calendar className="text-primary" size={20} />
                <Typography variant="h4">{upcomingTours}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Upcoming Tours
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={3}>
          <StatCard>
            <Box p={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Users className="text-success" size={20} />
                <Typography variant="h4">{totalCapacity}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Capacity
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={3}>
          <StatCard>
            <Box p={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Clock className="text-warning" size={20} />
                <Typography variant="h4">{totalTours}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Active Tours
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={3}>
          <StatCard>
            <Box p={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <DollarSign className="text-info" size={20} />
                <Typography variant="h4">${totalRevenue}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Revenue (Expected)
              </Typography>
            </Box>
          </StatCard>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs 
            value={activeTab} 
            onChange={(_e, v) => setActiveTab(v)}
          >
            <Tab 
              value="upcoming" 
              label="Upcoming Tours" 
              icon={<Calendar className="w-4 h-4" />}
              iconPosition="start"
            />
            <Tab 
              value="tours" 
              label="Tour Catalog" 
              icon={<MapPin className="w-4 h-4" />}
              iconPosition="start"
            />
            <Tab 
              value="guides" 
              label="Tour Guides" 
              icon={<Users className="w-4 h-4" />}
              iconPosition="start"
            />
          </Tabs>
          <Button 
            variant="contained" 
            startIcon={<Plus size={20} />}
            onClick={onEditClick}
          >
            Add New Tour
          </Button>
        </Box>

        {activeTab === 'upcoming' && (
          <Grid container spacing={2}>
            {tours.map(tour => (
              tour.schedule?.map(event => (
                <Grid item xs={12} md={6} key={`${tour.id}-${event.id}`}>
                  <Card>
                    <Box sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">{tour.name}</Typography>
                        <Chip 
                          label={event.status}
                          color={
                            event.status === 'available' ? 'success' :
                            event.status === 'booked' ? 'primary' : 'error'
                          }
                          size="small"
                        />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Date:
                          </Typography>
                          <Typography>{event.date}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Time:
                          </Typography>
                          <Typography>
                            {event.startTime} - {event.endTime}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Guide:
                          </Typography>
                          <Typography>{tour.guide.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Bookings:
                          </Typography>
                          <Typography>
                            {event.currentBookings}/{tour.maxParticipants}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Meeting Point:
                          </Typography>
                          <Typography>{event.meetingPoint}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              ))
            ))}
          </Grid>
        )}

        {activeTab === 'tours' && (
          <Grid container spacing={2}>
            {tours.map(tour => (
              <Grid item xs={12} key={tour.id}>
                <Card>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {tour.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {tour.description}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                          Duration:
                        </Typography>
                        <Typography>{tour.duration}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                          Price:
                        </Typography>
                        <Typography>${tour.price}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                          Max Participants:
                        </Typography>
                        <Typography>{tour.maxParticipants}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="text.secondary">
                          Active Schedules:
                        </Typography>
                        <Typography>
                          {tour.schedule?.length || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 'guides' && (
          <Grid container spacing={2}>
            {tours.map(tour => (
              <Grid item xs={12} md={4} key={`guide-${tour.id}`}>
                <Card>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {tour.guide.name}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Certifications:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {tour.guide.certifications.map((cert, index) => (
                          <Chip 
                            key={index}
                            label={cert}
                            size="small"
                          />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Experience:
                      </Typography>
                      <Typography>
                        {tour.guide.experience}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}