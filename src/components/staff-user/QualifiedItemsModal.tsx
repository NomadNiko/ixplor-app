import { useState, useEffect } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { X, Plus, Minus } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { useSnackbar } from '@/hooks/use-snackbar';

interface BookingItem {
  _id: string;
  productName: string;
  description: string;
}

interface QualifiedItemsModalProps {
  open: boolean;
  onClose: () => void;
  staffId: string;
  vendorId: string;
  qualifiedProducts: string[];
  onUpdate: () => void;
}

export default function QualifiedItemsModal({
  open,
  onClose,
  staffId,
  vendorId,
  qualifiedProducts,
  onUpdate
}: QualifiedItemsModalProps) {
  const { t } = useTranslation("staff-users");
  const { enqueueSnackbar } = useSnackbar();
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadBookingItems = async () => {
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) return;

        const response = await fetch(`${API_URL}/booking-items/by-vendor/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load booking items');
        }

        const data = await response.json();
        setBookingItems(data.data);
      } catch (error) {
        console.error('Error loading booking items:', error);
        enqueueSnackbar(t('errors.loadItemsFailed'), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadBookingItems();
    }
  }, [open, vendorId, t, enqueueSnackbar]);

  const handleToggleQualification = async (bookingItemId: string, isQualified: boolean) => {
    try {
      setUpdating(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) return;

      const endpoint = `${API_URL}/staff-users/${staffId}/qualifications`;
      const method = isQualified ? 'DELETE' : 'POST';
      const body = isQualified ? undefined : JSON.stringify({ bookingItemId });

      const response = await fetch(`${endpoint}${isQualified ? `/${bookingItemId}` : ''}`, {
        method,
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`,
          'Content-Type': 'application/json'
        },
        body
      });

      if (!response.ok) {
        throw new Error(isQualified ? 'Failed to remove qualification' : 'Failed to add qualification');
      }

      onUpdate();
      enqueueSnackbar(
        t(isQualified ? 'success.qualificationRemoved' : 'success.qualificationAdded'), 
        { variant: 'success' }
      );
    } catch (error) {
      console.error('Error updating qualification:', error);
      enqueueSnackbar(t('errors.updateQualificationFailed'), { variant: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {t('qualifiedItems')}
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {bookingItems.map((item) => {
              const isQualified = qualifiedProducts.includes(item._id);
              return (
                <ListItem 
                  key={item._id}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemText
                    primary={item.productName}
                    secondary={item.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleToggleQualification(item._id, isQualified)}
                      disabled={updating}
                      color={isQualified ? "error" : "success"}
                    >
                      {isQualified ? <Minus size={20} /> : <Plus size={20} />}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}