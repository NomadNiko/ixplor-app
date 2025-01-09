//import { Card, Typography, Box, Button, Grid, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { VendorFinancialData } from '../../finance-types';

interface VendorFinanceCardProps {
  data: VendorFinancialData;
  onViewDetails: (vendor: VendorFinancialData) => void;
}

export default function VendorFinanceCard({ data, onViewDetails }: VendorFinanceCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card className="p-4 mb-4">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <div>
          <Typography variant="h6">{data.vendorName}</Typography>
          <Chip 
            label={data.vendorType.toUpperCase()} 
            size="small" 
            className="mt-1"
          />
        </div>
        <Button 
          variant="outlined" 
          onClick={() => onViewDetails(data)}
        >
          View Details
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Available Balance
          </Typography>
          <Typography variant="h6">
            {formatCurrency(data.availableBalance.value)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Pending Balance
          </Typography>
          <Typography variant="h6">
            {formatCurrency(data.pendingBalance.value)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Revenue (30 days)
          </Typography>
          <Typography variant="h6">
            {formatCurrency(data.lifetimeRevenue.value)}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}