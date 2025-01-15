import { useState } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { useTranslation } from "@/services/i18n/client";
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";
import { Check, X, AlertTriangle, Trash2 } from 'lucide-react';
import { Image } from "@nextui-org/react";
import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';
import Divider from '@mui/material/Divider';
import { useSnackbar } from "@/hooks/use-snackbar";

interface VendorManagementCardProps {
  vendor: Vendor;
  onAction: (id: string, action: VendorStatusEnum, notes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const VendorManagementCard: React.FC<VendorManagementCardProps> = ({
  vendor,
  onAction,
  onDelete
}) => {
  const { t } = useTranslation("vendor-admin");
  const { enqueueSnackbar } = useSnackbar();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const getStatusColor = (status: VendorStatusEnum) => {
    switch(status) {
      case VendorStatusEnum.APPROVED: return 'success';
      case VendorStatusEnum.REJECTED: return 'error';
      case VendorStatusEnum.ACTION_NEEDED: return 'warning';
      case VendorStatusEnum.SUBMITTED: return 'info';
      case VendorStatusEnum.PENDING_APPROVAL: return 'primary';
      default: return 'default';
    }
  };

  const handleAction = async (action: VendorStatusEnum) => {
    if (isSubmitting) return;
    
    if ((action === VendorStatusEnum.REJECTED || action === VendorStatusEnum.ACTION_NEEDED) && !notes.trim()) {
      enqueueSnackbar(t('errors.notesRequired'), { variant: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    await onAction(vendor._id, action, notes);
    setIsSubmitting(false);
    setNotes('');
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: t('deleteConfirm.title'),
      message: t('deleteConfirm.message'),
      successButtonText: t('deleteConfirm.confirm'),
      cancelButtonText: t('deleteConfirm.cancel'),
    });

    if (confirmed) {
      setIsSubmitting(true);
      await onDelete(vendor._id);
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent sx={{ position: 'relative' }}>
        {/* Vendor Status Chip */}
        <Chip 
          label={t(`status.${vendor.vendorStatus.toLowerCase()}`)} 
          color={getStatusColor(vendor.vendorStatus)}
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16 
          }}
        />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          mb: 2
        }}>
          <Box sx={{ 
            width: { xs: '100%', sm: 100 },
            height: { xs: 100, sm: 100 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Image
              src={vendor.logoUrl}
              alt={vendor.businessName}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              {vendor.businessName}
            </Typography>
            
            <Typography 
              color="text.secondary" 
              paragraph 
              variant="body2"  // Make description text smaller
              sx={{ mb: 1 }}  // Reduce bottom margin
            >
              {vendor.description}
            </Typography>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2
            }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("contact")}
                </Typography>
                <Typography>{vendor.email}</Typography>
                <Typography>{vendor.phone}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("location")}
                </Typography>
                <Typography>{vendor.address}</Typography>
                <Typography>{vendor.city}, {vendor.state} {vendor.postalCode}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder={t("notesPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap'
        }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Check size={16} />}
            onClick={() => handleAction(VendorStatusEnum.APPROVED)}
            disabled={isSubmitting}
          >
            {t("approve")}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<X size={16} />}
            onClick={() => handleAction(VendorStatusEnum.REJECTED)}
            disabled={isSubmitting}
          >
            {t("reject")}
          </Button>

          <Button
            variant="contained"
            color="warning"
            startIcon={<AlertTriangle size={16} />}
            onClick={() => handleAction(VendorStatusEnum.ACTION_NEEDED)}
            disabled={isSubmitting}
          >
            {t("needsAction")}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<Trash2 size={16} />}
            onClick={handleDelete}
            disabled={isSubmitting}
            sx={{ ml: 'auto' }}
          >
            {t("delete")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};