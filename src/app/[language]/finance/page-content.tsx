/* eslint-disable no-restricted-syntax */
//import { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
//import IconButton from "@mui/material/IconButton";
//import Tooltip from "@mui/material/Tooltip";
import {
  TrendingUp,
  TrendingDown,
  //Info,
  DollarSign,
  Clock,
  LineChart as ChartIcon,
} from "lucide-react";
import {
  mockAggregateData,
  mockVendorFinancialData,
} from "./finance-mock-data";
import { VendorFinancialData } from "./finance-types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart, // Import PieChart
    Pie, // Import Pie
    Cell, // Import Cell
  } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Define COLORS


const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  border: "1px solid",
  borderColor: theme.palette.divider,
}));

const MetricLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  direction: "up" | "down" | "neutral";
  icon: typeof DollarSign;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  direction,
  icon: Icon,
  color,
}) => (
  <StyledCard>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Icon style={{ color, fontSize: 40, marginRight: 16 }} />
          <div>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h4">{formatCurrency(value)}</Typography>
          </div>
        </Box>
        <Box display="flex" alignItems="center">
          <MetricLabel>
            {change > 0 ? "+" : ""}
            {change}% from last month
          </MetricLabel>
          <Chip
            icon={
              direction === "up" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )
            }
            label={direction === "up" ? "Increase" : "Decrease"}
            size="small"
            sx={{
              marginLeft: 1,
              backgroundColor:
                direction === "up"
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(244, 67, 54, 0.1)",
              color: direction === "up" ? "#4CAF50" : "#f44336",
            }}
          />
        </Box>
      </Box>
    </CardContent>
  </StyledCard>
);

const VendorTypeSection: React.FC<{ data: VendorFinancialData }> = ({
  data,
}) => {
  const getMetricsByType = () => {
    switch (data.vendorType) {
      case "tours":
        return [
          { label: "Completed Tours", value: data.tourBookings.completed },
          { label: "Upcoming Tours", value: data.tourBookings.upcoming },
          {
            label: "Average Booking Value",
            value: formatCurrency(data.averageBookingValue),
          },
        ];
      case "tickets":
        return [
          { label: "Daily Sales", value: data.ticketSales.daily },
          { label: "Monthly Sales", value: data.ticketSales.monthly },
          {
            label: "Redemption Rate",
            value: `${(data.redemptionRate * 100).toFixed(1)}%`,
          },
        ];
      case "rentals":
        return [
          {
            label: "Active Rentals",
            value: data.rentalMetrics.activeRentals,
          },
          {
            label: "Utilization Rate",
            value: `${(data.rentalMetrics.utilization * 100).toFixed(1)}%`,
          },
          {
            label: "Equipment Value",
            value: formatCurrency(data.equipmentValue),
          },
        ];
      case "lessons":
        return [
          {
            label: "Completed Lessons",
            value: data.lessonMetrics.completedLessons,
          },
          {
            label: "Upcoming Lessons",
            value: data.lessonMetrics.upcomingLessons,
          },
          {
            label: "Student Retention",
            value: `${(data.studentRetentionRate * 100).toFixed(1)}%`,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            {data.vendorName}
          </Typography>
          <Typography color="textSecondary">
            Available Balance: {formatCurrency(data.availableBalance.value)}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {getMetricsByType().map((metric, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box textAlign="center">
                <Typography variant="h5" gutterBottom>
                  {metric.value}
                </Typography>
                <Typography color="textSecondary">
                  {metric.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box mt={3} height={200}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={
                data.vendorType === "tours"
                  ? data.tourBookings.dates.map((date, index) => ({
                      date,
                      revenue: data.tourBookings.revenue[index],
                    }))
                  : data.vendorType === "tickets"
                  ? data.ticketSales.dates.map((date, index) => ({
                      date,
                      revenue: data.ticketSales.revenue[index],
                    }))
                  : data.vendorType === "rentals"
                  ? data.rentalMetrics.dates.map((date, index) => ({
                      date,
                      revenue: data.rentalMetrics.revenue[index],
                    }))
                  : data.lessonMetrics.dates.map((date, index) => ({
                      date,
                      revenue: data.lessonMetrics.revenue[index],
                    }))
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default function FinanceContent() {
  //const [selectedPeriod, setSelectedPeriod] = useState("month");

  return (
    <Box p={3}>
      {/* Aggregate Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Financial Overview
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Available Balance"
            value={mockAggregateData.totalBalance.value}
            change={mockAggregateData.totalBalance.change}
            direction={mockAggregateData.totalBalance.trend}
            icon={DollarSign}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Pending Balance"
            value={mockAggregateData.totalPending.value}
            change={mockAggregateData.totalPending.change}
            direction={mockAggregateData.totalPending.trend}
            icon={Clock}
            color="#FFA726"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Total Revenue"
            value={mockAggregateData.totalRevenue.value}
            change={mockAggregateData.totalRevenue.change}
            direction={mockAggregateData.totalRevenue.trend}
            icon={ChartIcon}
            color="#2196F3"
          />
        </Grid>
      </Grid>

      {/* Revenue Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue by Vendor Type
              </Typography>
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockAggregateData.dailyRevenue}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tours"
                      stroke="#8884d8"
                    />
                    <Line
                      type="monotone"
                      dataKey="tickets"
                      stroke="#82ca9d"
                    />
                    <Line
                      type="monotone"
                      dataKey="rentals"
                      stroke="#ffc658"
                    />
                    <Line
                      type="monotone"
                      dataKey="lessons"
                      stroke="#ff7300"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Distribution
              </Typography>
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockAggregateData.revenueByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {mockAggregateData.revenueByType.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Vendor Type Sections */}
      <Grid container spacing={3}>
        {mockVendorFinancialData.map((vendorData) => (
          <Grid item xs={12} key={vendorData.id}>
            <VendorTypeSection data={vendorData} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}