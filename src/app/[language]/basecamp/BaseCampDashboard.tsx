"use client";
import { useState } from 'react';
import { 
  Store, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { mockVendorDetails } from '../vendor/mock-data';
import { mockVendorFinancialData, mockAggregateData } from '../finance/finance-mock-data';
import { formatCurrency } from '../utils/formatters';

// Integrate existing mock data into our new design
export default function BaseCampDashboard() {
  const [timeRange, setTimeRange] = useState('week');
  
  // Calculate key metrics from mock data
  //const totalVendors = mockVendorDetails.length;
  const activeVendors = mockVendorDetails.filter(v => v.status === 'published').length;
  const totalRevenue = mockVendorFinancialData.reduce(
    (sum, vendor) => sum + vendor.lifetimeRevenue.value, 0
  );
  const totalPendingBalance = mockVendorFinancialData.reduce(
    (sum, vendor) => sum + vendor.pendingBalance.value, 0
  );

  type Activity = {
    id: string;
    type: 'Tour' | 'Lesson' | 'Rental Return';
    title: string;
    time: string;
    status: 'booked' | 'pending' | 'available' | 'cancelled';
    value: string;
  };
  // Get upcoming activities from tours, lessons, and rentals
   const getUpcomingActivities = (): Activity[] => {
    const activities: Activity[] = [];
    
    
    mockVendorDetails.forEach(vendor => {
      if (vendor.tours) {
        vendor.tours.forEach(tour => {
          tour.schedule.forEach(event => {
            if (event.status === 'booked') {
              activities.push({
                id: `tour-${event.id}`,
                type: 'Tour',
                title: tour.name,
                time: event.startTime,
                status: event.status,
                value: formatCurrency(tour.price)
              });
            }
          });
        });
      }
      
      if (vendor.lessons) {
        vendor.lessons.forEach(lesson => {
          if (lesson.status === 'booked' && lesson.scheduledDate) {
            activities.push({
              id: `lesson-${lesson.id}`,
              type: 'Lesson',
              title: lesson.name,
              time: lesson.duration,
              status: lesson.status,
              value: formatCurrency(lesson.price)
            });
          }
        });
      }

      if (vendor.rentals) {
        vendor.rentals.forEach(rental => {
          if (rental.dueIn > 0) {
            activities.push({
              id: `rental-${rental.id}`,
              type: 'Rental Return',
              title: rental.name,
              time: 'Due Today',
              status: 'pending',
              value: `${rental.dueIn} units`
            });
          }
        });
      }
    });

    return activities.sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5);
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Container maxWidth="xl" className="py-8">
        {/* Header */}
        <Box className="mb-8">
          <Typography 
            variant="h3" 
            className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
            gutterBottom
          >
            BaseCamp
          </Typography>
          <Typography variant="body1" className="text-slate-400">
            Your business command center. Manage operations and track performance.
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} className="mb-8">
          {[
            {
              title: 'Total Revenue',
              value: formatCurrency(totalRevenue),
              change: `${mockAggregateData.totalRevenue.change}%`,
              icon: DollarSign,
              trend: mockAggregateData.totalRevenue.trend,
              color: 'primary'
            },
            {
              title: 'Active Vendors',
              value: activeVendors,
              change: '+12.5%',
              icon: Store,
              trend: 'up',
              color: 'success'
            },
            {
              title: 'Pending Balance',
              value: formatCurrency(totalPendingBalance),
              change: `${mockAggregateData.totalPending.change}%`,
              icon: TrendingUp,
              trend: mockAggregateData.totalPending.trend,
              color: 'warning'
            },
            {
              title: 'Total Bookings',
              value: mockVendorDetails.reduce((sum, vendor) => 
                sum + (vendor.tours?.reduce((acc, tour) => 
                  acc + tour.schedule.filter(s => s.status === 'booked').length, 0
                ) || 0), 0
              ),
              change: '+8.2%',
              icon: Calendar,
              trend: 'up',
              color: 'info'
            }
          ].map((stat, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Card className="p-6 bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                <Box className="flex justify-between items-start mb-4">
                  <Box>
                    <Typography className="text-slate-400" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box className={`p-2 rounded-lg bg-${stat.color.toLowerCase()}-500/20`}>
                    <stat.icon className={`text-${stat.color.toLowerCase()}-400`} size={20} />
                  </Box>
                </Box>
                <Box className="flex items-center gap-2">
                  <Typography 
                    variant="body2"
                    className={stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}
                  >
                    {stat.change}
                  </Typography>
                  <Typography variant="body2" className="text-slate-400">
                    vs last month
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts and Activity Feed */}
        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} lg={8}>
            <Card className="p-6 bg-slate-800/50 border border-slate-700/50">
              <Box className="flex justify-between items-center mb-6">
                <Typography variant="h6">Revenue Overview</Typography>
                <Box className="flex gap-2">
                  {['week', 'month', 'year'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        timeRange === range 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </Box>
              </Box>
              
              <Box className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockAggregateData.dailyRevenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="tours" 
                      stackId="1"
                      stroke="#3B82F6" 
                      fill="url(#colorRevenue)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tickets" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="url(#colorRevenue)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rentals" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* Activity Feed */}
          <Grid item xs={12} lg={4}>
            <Card className="p-6 bg-slate-800/50 border border-slate-700/50">
              <Box className="flex justify-between items-center mb-6">
              <Typography variant="h6">Today&apos;s Schedule</Typography>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  View Calendar <ChevronRight size={16} />
                </button>
              </Box>
              
              <Box className="space-y-4">
                {getUpcomingActivities().map((activity) => (
                  <Card 
                    key={activity.id}
                    className="p-4 bg-slate-700/30 border border-slate-600/30 hover:border-slate-600/50 transition-all"
                  >
                    <Box className="flex justify-between items-start mb-2">
                      <Box>
                        <Typography variant="body2" className="text-slate-400">
                          {activity.type}
                        </Typography>
                        <Typography variant="body1">
                          {activity.title}
                        </Typography>
                      </Box>
                      <Typography variant="body1" className="text-blue-400">
                        {activity.value}
                      </Typography>
                    </Box>
                    <Box className="flex justify-between items-center">
                      <Typography variant="body2" className="text-slate-400">
                        {activity.time}
                      </Typography>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        activity.status === 'booked' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}