import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FinanceOverview from './FinanceOverview';
import VendorFinanceList from './VendorFinanceList';
import VendorDetailView from './VendorDetailView';
import { useState } from 'react';
import { VendorFinancialData } from '../../finance-types';

export default function FinanceDashboard() {
  const [selectedVendor, setSelectedVendor] = useState<VendorFinancialData | null>(null);

  if (selectedVendor) {
    return (
      <VendorDetailView 
        data={selectedVendor} 
        onBack={() => setSelectedVendor(null)} 
      />
    );
  }

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom>Financial Overview</Typography>
      <FinanceOverview />
      <Typography variant="h5" gutterBottom className="mt-6">Vendor Financial Status</Typography>
      <VendorFinanceList onVendorSelect={setSelectedVendor} />
    </Box>
  );
}