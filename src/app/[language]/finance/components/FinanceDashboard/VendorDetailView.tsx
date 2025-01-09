import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { FileDown, Printer, Mail } from 'lucide-react';
import { VendorFinancialData } from '../../finance-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VendorDetailViewProps {
  data: VendorFinancialData;
  onBack: () => void;
}

export default function VendorDetailView({ data, onBack }: VendorDetailViewProps) {
  const getRevenueData = () => {
    switch (data.vendorType) {
      case 'tours':
        return data.tourBookings.dates.map((date, index) => ({
          date,
          revenue: data.tourBookings.revenue[index],
        }));
      case 'tickets':
        return data.ticketSales.dates.map((date, index) => ({
          date,
          revenue: data.ticketSales.revenue[index],
        }));
      case 'rentals':
        return data.rentalMetrics.dates.map((date, index) => ({
          date,
          revenue: data.rentalMetrics.revenue[index],
        }));
      case 'lessons':
        return data.lessonMetrics.dates.map((date, index) => ({
          date,
          revenue: data.lessonMetrics.revenue[index],
        }));
    }
  };

  return (
    <Box className="p-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button onClick={onBack}>Back to Overview</Button>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<FileDown />} variant="outlined">
            Export
          </Button>
          <Button startIcon={<Printer />} variant="outlined">
            Print
          </Button>
          <Button startIcon={<Mail />} variant="outlined">
            Email
          </Button>
        </Stack>
      </Box>

      <Card className="p-4 mb-4">
        <Typography variant="h5" gutterBottom>
          {data.vendorName} - Revenue Overview
        </Typography>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getRevenueData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card className="p-4">
            <Typography variant="subtitle2" color="text.secondary">
              Available Balance
            </Typography>
            <Typography variant="h4">
              ${data.availableBalance.value.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className="p-4">
            <Typography variant="subtitle2" color="text.secondary">
              Pending Balance
            </Typography>
            <Typography variant="h4">
              ${data.pendingBalance.value.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className="p-4">
            <Typography variant="subtitle2" color="text.secondary">
              30-Day Revenue
            </Typography>
            <Typography variant="h4">
              ${data.lifetimeRevenue.value.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}