import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useTranslation } from "@/services/i18n/client";
import { format } from 'date-fns';
import { TicketWithUserName } from './types';

interface TicketCardProps {
  ticket: TicketWithUserName;
  onRedeemTicket: (ticketId: string) => Promise<void>;
  readOnly?: boolean;
}

export default function TicketCard({ 
  ticket, 
  onRedeemTicket, 
  readOnly = false 
}: TicketCardProps) {
  const { t } = useTranslation("vendor-tickets");

  return (
    <Card sx={{ mb: 2 }}>
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

        {!readOnly && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => onRedeemTicket(ticket._id)}
            disabled={ticket.status !== 'ACTIVE'}
          >
            {t('redeem')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}