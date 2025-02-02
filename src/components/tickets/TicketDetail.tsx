import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import { Download, Ticket as TicketIcon, ExternalLink } from "lucide-react";
import { format, isValid } from 'date-fns';
import type { Ticket } from '@/hooks/use-tickets';
import QRGenerator from "./QRGenerator";

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onClose }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'N/A';
  };

  const getStatusColor = (status: string): "success" | "error" | "warning" | "info" => {
    switch (status) {
      case 'ACTIVE': return "success";
      case 'REDEEMED': return "info";
      case 'CANCELLED': return "error";
      case 'REVOKED': return "warning";
      default: return "info";
    }
  };

  const handleExportTicket = () => {
    // Implementation for exporting ticket details as PDF or similar format
    console.log('Export ticket:', ticket._id);
  };

  const handleOpenMap = () => {
    if (ticket.productLocation) {
      const { coordinates } = ticket.productLocation;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`,
        '_blank'
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <TicketIcon size={24} />
        <Typography variant="h5">{ticket.productName}</Typography>
      </Box>

      <Alert severity={getStatusColor(ticket.status)} sx={{ mb: 3 }}>
        {`Ticket Status: ${ticket.status}`}
      </Alert>

      <Box sx={{ mb: 4 }}>
        <QRGenerator ticketId={ticket._id} transactionId={ticket.transactionId} />
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Typography color="text.secondary" variant="caption" display="block">
            Date
          </Typography>
          <Typography>{formatDate(ticket.productDate)}</Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography color="text.secondary" variant="caption" display="block">
            Time
          </Typography>
          <Typography>{ticket.productStartTime || 'N/A'}</Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography color="text.secondary" variant="caption" display="block">
            Duration
          </Typography>
          <Typography>
            {ticket.productDuration ? `${ticket.productDuration} hours` : 'N/A'}
          </Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography color="text.secondary" variant="caption" display="block">
            Quantity
          </Typography>
          <Typography>{ticket.quantity}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography color="text.secondary" variant="caption" display="block">
            Location
          </Typography>
          {ticket.productLocation ? (
            <Button
              variant="text"
              size="small"
              onClick={handleOpenMap}
              endIcon={<ExternalLink size={16} />}
            >
              View on Map
            </Button>
          ) : (
            <Typography>N/A</Typography>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Additional Information
      </Typography>
      
      {ticket.productAdditionalInfo && (
        <Typography variant="body2" paragraph>
          {ticket.productAdditionalInfo}
        </Typography>
      )}

      {ticket.productRequirements && ticket.productRequirements.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Requirements
          </Typography>
          <ul>
            {ticket.productRequirements.map((req, index) => (
              <li key={index}>
                <Typography variant="body2">{req}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      )}

      {ticket.productWaiver && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Waiver Notice
          </Typography>
          <Typography variant="body2">
            {ticket.productWaiver}
          </Typography>
        </Alert>
      )}

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: 2, 
        mt: 4 
      }}>
        <Button
          variant="outlined"
          startIcon={<Download size={16} />}
          onClick={handleExportTicket}
        >
          Export Ticket
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