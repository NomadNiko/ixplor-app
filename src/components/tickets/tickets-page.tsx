import { useState } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { styled } from '@mui/material/styles';
import { useTranslation } from "@/services/i18n/client";
import { useTickets, Ticket } from '@/hooks/use-tickets';
import TicketCard from './TicketCard';
import TicketDetail from './TicketDetail';

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  overflowY: 'scroll',
  '& .MuiBox-root': {
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    width: '95%',
    maxWidth: '440px',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      margin: theme.spacing(1),
    },
  },
}));

export default function TicketsPage() {
  const { t } = useTranslation("tickets");
  const { activeTickets, oldTickets, loading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)' 
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Active Tickets */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          {t("upcomingTickets")}
        </Typography>
        {activeTickets.length === 0 ? (
          <Typography color="text.secondary">
            {t("noUpcomingTickets")}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {activeTickets.map(ticket => (
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6} key={ticket._id}>
                <TicketCard
                  ticket={ticket}
                  onClick={() => setSelectedTicket(ticket)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Past Tickets */}
      {oldTickets.length > 0 && (
        <Box>
          <Typography variant="h4" gutterBottom>
            {t("oldTickets")}
          </Typography>
          <Grid container spacing={3}>
            {oldTickets.map(ticket => (
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6} key={ticket._id}>
                <TicketCard
                  ticket={ticket}
                  onClick={() => setSelectedTicket(ticket)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Ticket Detail Modal */}
      <StyledModal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      >
        <Box sx={{justifyContent: 'center', alignItems: 'center', maxWidth: '350px'}}>
          {selectedTicket && (
            <TicketDetail
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
            />
          )}
        </Box>
      </StyledModal>
    </Container>
  );
}