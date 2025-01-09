import Grid from '@mui/material/Grid';
import FinanceMetricCard from './FinanceMetricCard';
import { mockAggregateData, mockVendorFinancialData } from '../../finance-mock-data';

export default function FinanceOverview() {
  const totalAvailableBalance = mockVendorFinancialData.reduce(
    (sum, vendor) => sum + vendor.availableBalance.value, 0
  );
  
  const totalPendingBalance = mockVendorFinancialData.reduce(
    (sum, vendor) => sum + vendor.pendingBalance.value, 0
  );

  return (
    <Grid container spacing={3} className="mb-6">
      <Grid item xs={4}>
        <FinanceMetricCard
          label="Total Available Balance"
          value={totalAvailableBalance}
          change={mockAggregateData.totalBalance.change}
          changeColor="success.main"
        />
      </Grid>
      <Grid item xs={4}>
        <FinanceMetricCard
          label="Total Pending Balance"
          value={totalPendingBalance}
          change={mockAggregateData.totalPending.change}
          changeColor="warning.main"
        />
      </Grid>
      <Grid item xs={4}>
        <FinanceMetricCard
          label="Total Revenue (30 Days)"
          value={mockAggregateData.totalRevenue.value}
          change={mockAggregateData.totalRevenue.change}
          changeColor="info.main"
        />
      </Grid>
    </Grid>
  );
}