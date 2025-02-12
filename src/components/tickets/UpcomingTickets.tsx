import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { X, Clock, Calendar, QrCode, LogIn } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { useTheme } from "@mui/material/styles";
import { useTickets, Ticket } from '@/hooks/use-tickets';
import TicketDetail from '@/components/tickets/UpcomingTicketDetail';
import { format, parseISO } from 'date-fns';
import useAuth from '@/services/auth/use-auth';
import { useRouter } from 'next/navigation';

interface TicketItemProps {
  ticket: Ticket;
  onClick: () => void;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, onClick }) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      sx={{
        width: "100%",
        mb: theme.spacing(1),
        p: theme.spacing(2),
        textAlign: "left",
        display: "block",
        backgroundColor: "background.paper",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <Typography variant="subtitle1" color="text.primary">
        {ticket.productName}
      </Typography>
      <Box sx={{ display: "flex", gap: theme.spacing(2), mt: 1 }}>
        {ticket.productDate && (
          <Typography variant="body2" color="text.secondary">
            <Calendar
              size={14}
              style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
            />
            {format(parseISO(ticket.productDate), "PPP")}
          </Typography>
        )}
        {ticket.productStartTime && (
          <Typography variant="body2" color="text.secondary">
            <Clock
              size={14}
              style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
            />
            {ticket.productStartTime}
          </Typography>
        )}
      </Box>
    </Button>
  );
};

interface UpcomingTicketsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpcomingTicketsPanel: React.FC<UpcomingTicketsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation("tickets");
  const { activeTickets, loading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setSelectedTicket(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLoginClick = () => {
    router.push('/sign-in');
    onClose();
  };

  return (
    <>
      <Box
        className="modal-content"
        onClick={handleModalClick}
        sx={{
          position: "fixed",
          bottom: { xs: 70, md: 82 },
          left: { xs: 0, md: '50%' },
          right: { xs: 0, md: 'auto' },
          height: "75%",
          backgroundColor: "background.paper",
          borderTopLeftRadius: theme.spacing(2),
          borderTopRightRadius: theme.spacing(2),
          transform: { xs: 'none', md: 'translateX(-50%)' },
          width: { xs: '100%', sm: '600px' },
          boxShadow: 3,
          zIndex: 75,
          display: "flex",
          flexDirection: "column",
          transition: "bottom 0.3s ease-in-out",
          background: "rgba(17, 25, 40, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.125)",
          borderRadius: { xs: "12px 12px 0 0", md: 2 },
        }}
      >
        <Box
          sx={{
            p: theme.spacing(2),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <QrCode size={20} />
            <Typography variant="h6">{t("upcomingTickets")}</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: theme.spacing(2),
          }}
        >
          {!user ? (
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 2,
              height: "100%",
              py: 4 
            }}>
              <Typography color="text.secondary" align="center">
                {t("pleaseLogin")}
              </Typography>
              <Button
                variant="contained"
                startIcon={<LogIn size={16} />}
                onClick={handleLoginClick}
                sx={{
                  background: theme => theme.palette.customGradients.buttonMain,
                  '&:hover': {
                    background: theme => theme.palette.customGradients.buttonMain,
                    filter: 'brightness(0.9)',
                  }
                }}
              >
                {t("login")}
              </Button>
            </Box>
          ) : loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : activeTickets.length === 0 ? (
            <Typography
              color="text.secondary"
              align="center"
              sx={{ py: 4 }}
            >
              {t("noUpcomingTickets")}
            </Typography>
          ) : (
            activeTickets.map((ticket) => (
              <TicketItem
                key={ticket._id}
                ticket={ticket}
                onClick={() => setSelectedTicket(ticket)}
              />
            ))
          )}
        </Box>
      </Box>

      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
};

export default UpcomingTicketsPanel;