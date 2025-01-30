import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Ticket as TicketIcon } from "lucide-react";
import { format } from 'date-fns';
import type { Ticket } from '@/hooks/use-tickets';
import QRGenerator from "./QRGenerator";

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onClose }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <TicketIcon size={24} />
        <Typography variant="h5">{ticket.productName}</Typography>
      </Box>

      {/* QR Code Placeholder */}
      <QRGenerator ticketId={ticket._id} transactionId={ticket.transactionId} />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Typography color="text.secondary" variant="caption" display="block">
            Date
          </Typography>
          <Typography>
            {ticket.productDate ? format(new Date(ticket.productDate), 'MMMM d, yyyy') : 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="text.secondary" variant="caption" display="block">
            Time
          </Typography>
          <Typography>{ticket.productStartTime || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="text.secondary" variant="caption" display="block">
            Status
          </Typography>
          <Typography>{ticket.status}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="text.secondary" variant="caption" display="block">
            Transaction ID
          </Typography>
          <Typography noWrap>{ticket.transactionId}</Typography>
        </Grid>
      </Grid>

      <Typography color="text.secondary" variant="caption" display="block" gutterBottom>
        Description
      </Typography>
      <Typography variant="body2" paragraph>
        {ticket.productDescription}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => window.print()}
        >
          Export
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default TicketDetail;