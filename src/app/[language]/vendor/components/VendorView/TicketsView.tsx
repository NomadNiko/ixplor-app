"use client";

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { TicketProduct } from '@/types/vendor-types';
import { StatCard } from './styled/vendor-view-styled';

interface TicketsViewProps {
  tickets: TicketProduct[];
}

export default function TicketsView({ tickets }: TicketsViewProps) {
  return (
    <Grid container spacing={3}>
      {/* Stats Overview */}
      <Grid size={{ xs: 12 }} container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <InventoryIcon color="primary" />
                <Typography variant="h6">
                  {tickets.reduce((acc, ticket) => acc + ticket.availableCount, 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Available Tickets
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoneyIcon color="primary" />
                <Typography variant="h6">
                  {tickets.reduce((acc, ticket) => acc + ticket.soldCount, 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Tickets Sold
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Tickets List */}
      {tickets.map((ticket) => (
        <Grid key={ticket.id} size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {ticket.name}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={ticket.type} size="small" />
                <Typography variant="body2" color="primary">
                  ${ticket.price}
                </Typography>
              </Stack>

              <Box mt={2}>
                <Stack direction="row" spacing={3}>
                  <Typography variant="body2">
                    Available: {ticket.availableCount}
                  </Typography>
                  <Typography variant="body2">
                    Sold: {ticket.soldCount}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Valid: {ticket.validFrom} to {ticket.validTo}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}