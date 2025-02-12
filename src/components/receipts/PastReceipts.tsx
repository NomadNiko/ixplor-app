import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { X, Receipt, Clock, Calendar, LogIn } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { useTheme } from "@mui/material/styles";
import { useRouter } from 'next/navigation';
import useAuth from '@/services/auth/use-auth';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { useSnackbar } from "@/hooks/use-snackbar";
import InvoiceDetailModal from '@/components/receipts/InvoiceDetailModal';
import type { InvoiceResponseDto } from '@/types/invoice';

interface ReceiptItemProps {
  receipt: InvoiceResponseDto;
  onClick: () => void;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ receipt, onClick }) => {
  const theme = useTheme();
  const { t } = useTranslation("receipts");

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <Button
      onClick={handleClick}
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
        {receipt.vendorName}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <Calendar
            size={14}
            style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
          />
          {new Date(item.productDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="primary.main">
          ${receipt.amount.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: theme.spacing(2), mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          <Clock
            size={12}
            style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
          />
          {receipt.items.length} {t('itemsCount')}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: receipt.status === 'succeeded' ? 'success.main' : 'warning.main'
          }}
        >
          {receipt.status}
        </Typography>
      </Box>
    </Button>
  );
};

interface PastReceiptsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PastReceipts: React.FC<PastReceiptsProps> = ({
  isOpen,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation("receipts");
  const router = useRouter();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<InvoiceResponseDto[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<InvoiceResponseDto | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          enqueueSnackbar(t("errors.unauthorized"), { variant: "error" });
          return;
        }

        const response = await fetch(`${API_URL}/invoices/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch receipts");
        const data = await response.json();
        setReceipts(data);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        enqueueSnackbar(t("errors.fetchFailed"), { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && user?.id) {
      fetchReceipts();
    }
  }, [isOpen, user?.id, enqueueSnackbar, t]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedReceipt(null);
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
            <Receipt size={20} />
            <Typography variant="h6">{t("title")}</Typography>
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
          ) : receipts.length === 0 ? (
            <Typography
              color="text.secondary"
              align="center"
              sx={{ py: 4 }}
            >
              {t("noReceipts")}
            </Typography>
          ) : (
            receipts.map((receipt) => (
              <ReceiptItem
                key={receipt._id}
                receipt={receipt}
                onClick={() => setSelectedReceipt(receipt)}
              />
            ))
          )}
        </Box>
      </Box>

      {selectedReceipt && (
        <Box onClick={e => e.stopPropagation()}>
          <InvoiceDetailModal
            invoice={selectedReceipt}
            open={true}
            onClose={() => setSelectedReceipt(null)}
          />
        </Box>
      )}
    </>
  );
};

export default PastReceipts;