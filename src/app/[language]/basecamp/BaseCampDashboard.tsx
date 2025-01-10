"use client";
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { 
  Store, 
  DollarSign, 
  TrendingUp, 
  Users
} from 'lucide-react';
import { mockVendorDetails } from '../vendor/mock-data';
import { mockVendorFinancialData } from '../finance/finance-mock-data';
import WeeklyCalendar from './WeeklyCalendar';

const QuickStatsWidget = () => {
  const router = useRouter();
  const totalVendors = mockVendorDetails.length;
  const activeVendors = mockVendorDetails.filter(v => v.status === 'published').length;
  const totalRevenue = mockVendorFinancialData.reduce(
    (sum, v) => sum + v.lifetimeRevenue.value, 0
  );

  return (
    <Grid container spacing={2} className="mb-8">
      <Grid item xs={3}>
        <Card 
          className="p-4 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => router.push('/vendor')}
        >
          <Box className="flex items-center gap-3">
            <Store className="text-primary" />
            <div>
              <Typography variant="h4">{totalVendors}</Typography>
              <Typography variant="body2" color="text.secondary">Total Vendors</Typography>
            </div>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card 
          className="p-4 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => router.push('/finance')}
        >
          <Box className="flex items-center gap-3">
            <DollarSign className="text-success" />
            <div>
              <Typography variant="h4">
                ${(totalRevenue / 1000).toFixed(1)}k
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
            </div>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card 
          className="p-4 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => router.push('/vendor')}
        >
          <Box className="flex items-center gap-3">
            <TrendingUp className="text-info" />
            <div>
              <Typography variant="h4">{activeVendors}</Typography>
              <Typography variant="body2" color="text.secondary">Active Vendors</Typography>
            </div>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card 
          className="p-4 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => router.push('/onboard')}
        >
          <Box className="flex items-center gap-3">
            <Users className="text-warning" />
            <div>
              <Typography variant="h4">New</Typography>
              <Typography variant="body2" color="text.secondary">Onboard Vendor Profile</Typography>
            </div>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default function BaseCampDashboard() {
  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h3" gutterBottom>BaseCamp</Typography>
      <Typography variant="body1" color="text.secondary" className="mb-8">
        Your business command center. Manage your vendors, track performance, and grow your business.
      </Typography>

      <QuickStatsWidget />
      <WeeklyCalendar />
    </Container>
  );
}