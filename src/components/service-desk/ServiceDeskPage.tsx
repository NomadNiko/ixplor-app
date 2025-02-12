import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import { MessageCircle, Plus, Clock, User, LifeBuoy } from "lucide-react";
import { format } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from "@/services/auth/use-auth";
import CreateTicketForm from "./CreateTicketForm";
import UpdateTicketForm from "./UpdateTicketForm";
import { SupportTicket } from '../../types/support-ticket';
import { RoleEnum } from "@/services/api/types/role";

export default function ServiceDeskPage() {
  const { t } = useTranslation("service-desk");
  const { user } = useAuth();
   const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const isAdmin = user?.role?.id === RoleEnum.ADMIN;

  const loadTickets = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const endpoint = isAdmin ? 
        `${API_URL}/support-tickets` : 
        `${API_URL}/support-tickets?userId=${user.id}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data.tickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user?.id]);

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    loadTickets();
  };

  const handleUpdateSuccess = () => {
    setSelectedTicket(null);
    loadTickets();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPENED':
        return 'warning';
      case 'ASSIGNED':
        return 'info';
      case 'HOLD':
        return 'secondary';
      case 'RESOLVED':
        return 'success';
      case 'CLOSED':
        return 'default';
      default:
        return 'default';
    }
  };

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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <LifeBuoy size={32} />
          <Typography variant="h4">
            {t('title')}
          </Typography>
        </Box>
        <Typography color="text.secondary" paragraph>
          {t('description')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setCreateDialogOpen(true)}
        >
          {t('actions.createTicket')}
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
        {isAdmin ? t('allTickets') : t('yourTickets')}
      </Typography>

      <Grid container spacing={3}>
        {tickets.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              {t('noTickets')}
            </Typography>
          </Grid>
        ) : (
          tickets.map((ticket) => (
            <Grid item xs={12} key={ticket._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {ticket.ticketTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.ticketDescription}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={ticket.ticketCategory}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={t(`status.${ticket.status.toLowerCase()}`)}
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Clock size={16} />
                      {format(new Date(ticket.createDate), 'PPp')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <User size={16} />
                      {t('ticket')} #{ticket.ticketId}
                    </Typography>
                  </Box>

                  {ticket.updates.length > 0 && (
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        {t('latestUpdate')}:
                      </Typography>
                      <Typography variant="body2">
                        {ticket.updates[ticket.updates.length - 1].updateText}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {format(new Date(ticket.updates[ticket.updates.length - 1].timestamp), 'PPp')}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      startIcon={<MessageCircle />}
                      onClick={() => setSelectedTicket(ticket)}
                      disabled={ticket.status === 'CLOSED'}
                    >
                      {t('actions.addUpdate')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <CreateTicketForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setCreateDialogOpen(false)}
        />
      </Dialog>

      <Dialog
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedTicket && (
          <UpdateTicketForm
            ticket={selectedTicket}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setSelectedTicket(null)}
          />
        )}
      </Dialog>
    </Container>
  );
}