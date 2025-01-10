"use client";
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Store, DollarSign, TrendingUp, Users } from 'lucide-react';
import { mockVendorDetails } from '../vendor/mock-data';
import { mockVendorFinancialData } from '../finance/finance-mock-data';
import WeeklyCalendar from './WeeklyCalendar';

const QuickStatsWidget = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const totalVendors = mockVendorDetails.length;
  const activeVendors = mockVendorDetails.filter(v => v.status === 'published').length;
  const totalRevenue = mockVendorFinancialData.reduce(
    (sum, v) => sum + v.lifetimeRevenue.value, 0
  );

  return (
    <Grid container spacing={2} className="mb-8">
      {[
        {
          icon: <Store className="text-primary" />,
          value: totalVendors,
          label: "Total Vendors",
          onClick: () => router.push('/vendor')
        },
        {
          icon: <DollarSign className="text-success" />,
          value: `$${(totalRevenue / 1000).toFixed(1)}k`,
          label: "Total Revenue",
          onClick: () => router.push('/finance')
        },
        {
          icon: <TrendingUp className="text-info" />,
          value: activeVendors,
          label: "Active Vendors",
          onClick: () => router.push('/vendor')
        },
        {
          icon: <Users className="text-warning" />,
          value: "New",
          label: "Add Vendor",
          onClick: () => router.push('/onboard')
        }
      ].map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card 
            className="p-4 hover:scale-105 transition-transform cursor-pointer"
            onClick={stat.onClick}
            sx={{ height: '100%' }}
          >
            <Box className="flex items-center gap-3">
              {stat.icon}
              <div>
                <Typography variant={isMobile ? "h5" : "h4"}>{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </div>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default function BaseCampDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>BaseCamp</Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        className="mb-8"
        sx={{ 
          fontSize: isMobile ? '0.875rem' : '1rem',
          maxWidth: '100%',
          wordWrap: 'break-word'
        }}
      >
        Your business command center. Manage your vendors, track performance, and grow your business.
      </Typography>

      <QuickStatsWidget />
      <WeeklyCalendar />
    </Container>
  );
}