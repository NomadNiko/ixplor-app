"use client";
import { useState } from 'react';
import IconButton  from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import {
  Ticket,
  Calendar,
  BarChart3,
  Plus,
  Edit,
  AlertTriangle
} from 'lucide-react';
import { TicketProduct } from '@/types/vendor-types';
import { StatCard } from './styled/vendor-view-styled';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TicketsViewProps {
  tickets: TicketProduct[];
  onEditClick?: () => void;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

export default function TicketsView({ tickets, onEditClick }: TicketsViewProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Calculate summary statistics
  const totalAvailable = tickets.reduce((sum, ticket) => sum + ticket.availableCount, 0);
  const totalSold = tickets.reduce((sum, ticket) => sum + ticket.soldCount, 0);
  const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.soldCount), 0);
  const averagePrice = tickets.reduce((sum, ticket) => sum + ticket.price, 0) / tickets.length;

  // Prepare data for pie chart
  const salesByType = tickets.map(ticket => ({
    name: ticket.name,
    value: ticket.soldCount,
  }));

  // Prepare data for timeline - using mock data for demonstration
  const timelineData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sales: Math.floor(Math.random() * 100),
  })).reverse();

  return (
    <Box>
      {/* Quick Stats Section */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={3}>
          <StatCard>
            <Box p={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Ticket className="text-primary" size={20} />
                <Typography variant="h4">{totalAvailable}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Available Tickets
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={3}>
          <StatCard>
            <Box p={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <BarChart3 className="text-success" size={20} />
                <Typography variant="h4">{totalSold}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Tickets Sold
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={3}>
          <StatCard>
            <Box p={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Calendar className="text-warning" size={20} />
                <Typography variant="h4">${averagePrice.toFixed(0)}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Average Ticket Price
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={3}>
          <StatCard>
            <Box p={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <BarChart3 className="text-info" size={20} />
                <Typography variant="h4">${totalRevenue.toLocaleString()}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
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
              value="dashboard" 
              label="Dashboard" 
              icon={<BarChart3 className="w-4 h-4" />}
              iconPosition="start"
            />
            <Tab 
              value="tickets" 
              label="Ticket Types" 
              icon={<Ticket className="w-4 h-4" />}
              iconPosition="start"
            />
            <Tab 
              value="calendar" 
              label="Calendar" 
              icon={<Calendar className="w-4 h-4" />}
              iconPosition="start"
            />
          </Tabs>
          <Button 
            variant="contained" 
            startIcon={<Plus size={20} />}
            onClick={onEditClick}
          >
            Add New Ticket
          </Button>
        </Box>

        {activeTab === 'dashboard' && (
          <Grid container spacing={3}>
            {/* Sales Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <Box p={3}>
                  <Typography variant="h6" gutterBottom>
                    Sales Distribution by Ticket Type
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesByType}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {salesByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Sales Timeline Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <Box p={3}>
                  <Typography variant="h6" gutterBottom>
                    Sales Timeline
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#3B82F6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 'tickets' && (
          <Grid container spacing={2}>
            {tickets.map(ticket => (
              <Grid item xs={12} md={6} key={ticket.id}>
                <Card>
                  <Box sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <div>
                        <Typography variant="h6">{ticket.name}</Typography>
                        <Chip 
                          label={ticket.type.toUpperCase()} 
                          size="small" 
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                      </div>
                      <IconButton onClick={() => onEditClick?.()} size="small">
                        <Edit size={16} />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Price
                        </Typography>
                        <Typography variant="h6">
                          ${ticket.price}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Available
                        </Typography>
                        <Typography variant="h6">
                          {ticket.availableCount}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Sold
                        </Typography>
                        <Typography variant="h6">
                          {ticket.soldCount}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Valid Period
                        </Typography>
                        <Typography variant="body2">
                          {new Date(ticket.validFrom).toLocaleDateString()} - 
                          {new Date(ticket.validTo).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    {ticket.availableCount < 10 && (
                      <Box display="flex" alignItems="center" gap={1} mt={2}>
                        <AlertTriangle size={16} className="text-warning" />
                        <Typography variant="body2" color="warning.main">
                          Low inventory alert
                        </Typography>
                      </Box>
                    )}

                    {ticket.benefits && ticket.benefits.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Benefits:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {ticket.benefits.map((benefit, index) => (
                            <Chip 
                              key={index} 
                              label={benefit} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 'calendar' && (
          <Card>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Upcoming Events & Valid Dates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calendar view for managing ticket validity periods and special events coming soon...
              </Typography>
            </Box>
          </Card>
        )}
      </Box>
    </Box>
  );
}