import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from "@/services/auth/use-auth";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { format } from 'date-fns';

interface Ticket {
  _id: string;
  userId: string;
  productItemId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  status: 'ACTIVE' | 'CANCELLED' | 'REDEEMED' | 'REVOKED';
  quantity: number;
  productDate?: string;
  productStartTime?: string;
}

interface TicketWithUserName extends Ticket {
  userName: string;
}

const VendorTicketValidation: React.FC = () => {
  const { t } = useTranslation("vendor-tickets");
  const { user } = useAuth();

  const [tickets, setTickets] = useState<TicketWithUserName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token || !user?.id) {
          throw new Error('Unauthorized');
        }

        // Get vendor ID
        const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${user.id}/owned`, {
          headers: { 'Authorization': `Bearer ${tokensInfo.token}` }
        });

        if (!vendorResponse.ok) {
          throw new Error('Failed to fetch vendor information');
        }

        const vendorData = await vendorResponse.json();
        if (!vendorData.data.length) {
          throw new Error('No vendor profile found');
        }

        const vendorId = vendorData.data[0]._id;
        
        // Fetch vendor tickets
        const response = await fetch(`${API_URL}/tickets/vendor/${vendorId}`, {
          headers: { 'Authorization': `Bearer ${tokensInfo.token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load tickets');
        }

        const data = await response.json();
        const rawTickets = data.data as Ticket[];

        // Fetch user name for each ticket
        const ticketsWithUserNames = await Promise.all(
          rawTickets.map(async (ticket) => {
            try {
              const userNameResponse = await fetch(`${API_URL}/v1/users/${ticket.userId}/name`, {
                headers: { 'Authorization': `Bearer ${tokensInfo.token}` }
              });

              if (userNameResponse.ok) {
                const userData = await userNameResponse.json();
                const userName = userData.firstName && userData.lastName 
                  ? `${userData.firstName} ${userData.lastName}` 
                  : userData.email;
                
                return { ...ticket, userName };
              }
              
              return { ...ticket, userName: ticket.userId };
            } catch (error) {
              console.error(`Error fetching user name for ticket ${ticket._id}:`, error);
              return { ...ticket, userName: ticket.userId };
            }
          })
        );

        setTickets(ticketsWithUserNames);
      } catch (error) {
        console.error('Error loading tickets:', error);
        setError(t('errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user, t]);

  const handleRedeem = async (ticketId: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_URL}/tickets/${ticketId}/redeem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to redeem ticket');
      }

      const updatedTicket = await response.json();
      setTickets(prev => 
        prev.map(ticket => 
          ticket._id === ticketId ? { ...updatedTicket.data, userName: ticket.userName } : ticket
        )
      );
    } catch (error) {
      console.error('Error redeeming ticket:', error);
    }
  };

  const groupedTickets = useMemo(() => {
    return tickets.reduce((acc, ticket) => {
      if (!acc[ticket.productItemId]) {
        acc[ticket.productItemId] = {
          name: ticket.productName,
          activeTickets: [],
          redeemedTickets: []
        };
      }

      if (ticket.status === 'ACTIVE') {
        acc[ticket.productItemId].activeTickets.push(ticket);
      } else if (ticket.status === 'REDEEMED') {
        acc[ticket.productItemId].redeemedTickets.push(ticket);
      }

      return acc;
    }, {} as Record<string, { 
      name: string, 
      activeTickets: TicketWithUserName[], 
      redeemedTickets: TicketWithUserName[] 
    }>);
  }, [tickets]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>

      {Object.entries(groupedTickets).map(([productItemId, group]) => (
        <Box key={productItemId} sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {group.name}
          </Typography>

          {group.activeTickets.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {t('activeTickets')}
              </Typography>
              {group.activeTickets.map(ticket => (
                <Card key={ticket._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{ticket.productName}</Typography>
                      <Chip
                        label={t(`status.${ticket.status.toLowerCase()}`)}
                        color={ticket.status === 'ACTIVE' ? 'success' : 'default'}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
                      <Typography>
                        <strong>{t('customer')}:</strong> {ticket.userName}
                      </Typography>

                      <Typography>
                        <strong>{t('quantity')}:</strong> {ticket.quantity}
                      </Typography>

                      {ticket.productDate && (
                        <Typography>
                          <strong>{t('date')}:</strong>{' '}
                          {format(new Date(ticket.productDate), 'PPP')}
                          {ticket.productStartTime && ` at ${ticket.productStartTime}`}
                        </Typography>
                      )}

                      <Typography>
                        <strong>{t('price')}:</strong> ${ticket.productPrice.toFixed(2)}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleRedeem(ticket._id)}
                      disabled={ticket.status !== 'ACTIVE'}
                    >
                      {t('redeem')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {group.redeemedTickets.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
                {t('redeemedTickets')}
              </Typography>
              {group.redeemedTickets.map(ticket => (
                <Card key={ticket._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{ticket.productName}</Typography>
                      <Chip
                        label={t(`status.${ticket.status.toLowerCase()}`)}
                        color={ticket.status === 'ACTIVE' ? 'success' : 'default'}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
                      <Typography>
                        <strong>{t('customer')}:</strong> {ticket.userName}
                      </Typography>

                      <Typography>
                        <strong>{t('quantity')}:</strong> {ticket.quantity}
                      </Typography>

                      {ticket.productDate && (
                        <Typography>
                          <strong>{t('date')}:</strong>{' '}
                          {format(new Date(ticket.productDate), 'PPP')}
                          {ticket.productStartTime && ` at ${ticket.productStartTime}`}
                        </Typography>
                      )}

                      <Typography>
                        <strong>{t('price')}:</strong> ${ticket.productPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </Box>
      ))}

      {tickets.length === 0 && (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
          {t('noTickets')}
        </Typography>
      )}
    </Box>
  );
};

export default VendorTicketValidation;