import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Calendar } from "lucide-react";
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
import type { Ticket } from '@/hooks/use-tickets';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.glass,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  cursor: 'pointer',
}));

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      <Box sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        bgcolor: 'background.paper',
        fontSize: '0.75rem',
      }}>
        {ticket.status}
      </Box>
      
      <CardMedia
        component="img"
        height="160"
        image={ticket.productImageURL || '/api/placeholder/400/320'}
        alt={ticket.productName}
      />
      
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {ticket.productName}
        </Typography>
        {ticket.productDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} />
            <Typography variant="body2">
              {format(new Date(ticket.productDate), 'MMM d, yyyy')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default TicketCard;