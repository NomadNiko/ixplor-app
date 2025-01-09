import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { 
  Store, 
  //Calendar, 
  DollarSign, 
  TrendingUp,
  TrendingDown, 
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockVendorDetails } from '../vendor/mock-data';
import { mockVendorFinancialData } from '../finance/finance-mock-data';

// Quick Stats Widget Component
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
              <Typography variant="body2" color="text.secondary">Add Vendor</Typography>
            </div>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

// Preview Carousel Component
const PreviewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const previews = [
    ...mockVendorDetails.map(vendor => ({
      id: vendor.id,
      title: vendor.name,
      type: 'vendor',
      status: vendor.status,
      description: vendor.description,
      lastUpdated: vendor.lastUpdated
    })),
    ...mockVendorFinancialData.map(finance => ({
      id: finance.id,
      title: finance.vendorName,
      type: 'finance',
      amount: finance.availableBalance.value,
      trend: finance.availableBalance.trend,
      change: finance.availableBalance.change
    }))
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === previews.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? previews.length - 1 : prev - 1
    );
  };

  const handleCardClick = (item: typeof previews[0]) => {
    router.push(`/${item.type}/${item.id}`);
  };

  return (
    <Box className="relative mt-8">
      <Typography variant="h6" className="mb-4">Recent Activity</Typography>
      <Box className="flex items-center">
        <Button 
          onClick={prevSlide}
          className="absolute left-0 z-10"
          variant="text"
        >
          <ChevronLeft size={24} />
        </Button>

        <Box className="flex gap-4 overflow-hidden w-full py-4">
          {previews.slice(currentIndex, currentIndex + 4).map((item) => (
            <Card 
              key={`${item.type}-${item.id}`}
              className="flex-1 p-4 min-w-[250px] hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleCardClick(item)}
            >
              {'status' in item ? (
                // Vendor Preview
                <>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {item.status}
                  </Typography>
                  <Typography variant="body2" noWrap className="mt-2">
                    {item.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" className="mt-2">
                    Last updated: {item.lastUpdated}
                  </Typography>
                </>
              ) : (
                // Finance Preview
                <>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="h6" className="mt-2">
                    ${item.amount.toLocaleString()}
                  </Typography>
                  <Box className="flex items-center gap-2 mt-2">
                    {item.trend === 'up' ? 
                      <TrendingUp size={16} className="text-success" /> : 
                      <TrendingDown size={16} className="text-error" />
                    }
                    <Typography variant="caption" 
                      color={item.trend === 'up' ? 'success.main' : 'error.main'}
                    >
                      {item.change}%
                    </Typography>
                  </Box>
                </>
              )}
            </Card>
          ))}
        </Box>

        <Button 
          onClick={nextSlide}
          className="absolute right-0 z-10"
          variant="text"
        >
          <ChevronRight size={24} />
        </Button>
      </Box>
    </Box>
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
      <PreviewCarousel />
    </Container>
  );
}