import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import { TicketWithUserName } from './types';
import TicketCard from './TicketCard';

interface TicketGroupProps {
  productItemId: string;
  groupName: string;
  activeTickets: TicketWithUserName[];
  redeemedTickets: TicketWithUserName[];
  onRedeemTicket: (ticketId: string) => Promise<void>;
}

export default function TicketGroup({
  productItemId,
  groupName,
  activeTickets,
  redeemedTickets,
  onRedeemTicket
}: TicketGroupProps) {
  const { t } = useTranslation("vendor-tickets");

  return (
    <Box key={productItemId} sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {groupName}
      </Typography>

      {activeTickets.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {t('activeTickets')}
          </Typography>
          {activeTickets.map(ticket => (
            <TicketCard 
              key={ticket._id} 
              ticket={ticket} 
              onRedeemTicket={onRedeemTicket}
            />
          ))}
        </>
      )}

      {redeemedTickets.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
            {t('redeemedTickets')}
          </Typography>
          {redeemedTickets.map(ticket => (
            <TicketCard 
              key={ticket._id} 
              ticket={ticket} 
              onRedeemTicket={onRedeemTicket}
              readOnly
            />
          ))}
        </>
      )} 
    </Box>
  );
}