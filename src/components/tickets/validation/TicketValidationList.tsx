import { useMemo } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { TicketWithUserName } from './types';
import TicketGroup from './TicketGroup';
import { format, isValid, parseISO } from 'date-fns';

interface TicketValidationListProps {
  tickets: TicketWithUserName[];
  loading: boolean;
  error: string | null;
  onRedeemTicket: (ticketId: string) => Promise<void>;
}

export default function TicketValidationList({
  tickets,
  loading,
  error,
  onRedeemTicket
}: TicketValidationListProps) {
  const { t } = useTranslation("vendor-tickets");

  const groupedTicketsByDate = useMemo(() => {
    // First sort tickets by date
    const sortedTickets = [...tickets].sort((a, b) => {
      const dateA = a.productDate ? new Date(a.productDate) : new Date(0);
      const dateB = b.productDate ? new Date(b.productDate) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });

    // Then group by date, then by product item
    return sortedTickets.reduce((dateGroups, ticket) => {
      // Use date as primary key, or 'undated' for tickets without dates
      const dateKey = ticket.productDate || 'undated';
      
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = {};
      }

      // Within each date, group by product item
      if (!dateGroups[dateKey][ticket.productItemId]) {
        dateGroups[dateKey][ticket.productItemId] = {
          name: ticket.productName,
          activeTickets: [],
          redeemedTickets: []
        };
      }

      if (ticket.status === 'ACTIVE') {
        dateGroups[dateKey][ticket.productItemId].activeTickets.push(ticket);
      } else if (ticket.status === 'REDEEMED') {
        dateGroups[dateKey][ticket.productItemId].redeemedTickets.push(ticket);
      }

      return dateGroups;
    }, {} as Record<string, Record<string, {
      name: string,
      activeTickets: TicketWithUserName[],
      redeemedTickets: TicketWithUserName[]
    }>>);
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

  // Format date for display
  const formatDateHeading = (dateString: string) => {
    if (dateString === 'undated') {
      return t('undatedEvents');
    }
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'EEEE, MMMM d, yyyy');
      }
    } catch (e) {
      // Handle parsing errors
    }
    return dateString;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>

      {Object.keys(groupedTicketsByDate).length === 0 && (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
          {t('noTickets')}
        </Typography>
      )}

      {Object.entries(groupedTicketsByDate).map(([dateKey, productGroups]) => (
        <Box key={dateKey} sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              pb: 1, 
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            {formatDateHeading(dateKey)}
          </Typography>
          
          {Object.entries(productGroups).map(([productItemId, group]) => (
            <TicketGroup
              key={productItemId}
              productItemId={productItemId}
              groupName={group.name}
              activeTickets={group.activeTickets}
              redeemedTickets={group.redeemedTickets}
              onRedeemTicket={onRedeemTicket}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}