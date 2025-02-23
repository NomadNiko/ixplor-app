import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";
import { useStaffShifts } from '@/hooks/use-staff-shifts';
import { useForm, FormProvider } from 'react-hook-form';
import ShiftTimeInputs from '../generator/ShiftTimeInputs';
import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';

interface FormData {
    startTime: Date | null;
    endTime: Date | null;
  }

interface ShiftDetailModalProps {
  shift: {
    _id: string;
    startDateTime: string;
    endDateTime: string;
  } | null;
  staffId: string;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ShiftDetailModal({
  shift,
  staffId,
  open,
  onClose,
  onUpdate
}: ShiftDetailModalProps) {
  const { t } = useTranslation("staff-shifts");
  const { updateShifts, deleteShifts, isLoading } = useStaffShifts();
  const { confirmDialog } = useConfirmDialog();
  
  const methods = useForm({
    defaultValues: {
      startTime: shift ? new Date(shift.startDateTime) : null,
      endTime: shift ? new Date(shift.endDateTime) : null
    }
  });

  const handleUpdate = async (data: FormData) => {
    if (!shift || !data.startTime || !data.endTime) return;
    try {
      await updateShifts(staffId, [{
        shiftId: shift._id,
        startDateTime: data.startTime,
        endDateTime: data.endTime
      }]);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  const handleDelete = async () => {
    if (!shift) return;

    const confirmed = await confirmDialog({
      title: t('deleteShift.title'),
      message: t('deleteShift.message'),
      successButtonText: t('deleteShift.confirm'),
      cancelButtonText: t('deleteShift.cancel'),
    });

    if (confirmed) {
      try {
        await deleteShifts(staffId, [shift._id]);
        onUpdate();
        onClose();
      } catch (error) {
        console.error('Error deleting shift:', error);
      }
    }
  };

  if (!shift) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleUpdate)}>
          <DialogTitle>{t('editShift')}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <ShiftTimeInputs disabled={isLoading} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDelete}
              color="error"
              disabled={isLoading}
            >
              {t('delete')}
            </Button>
            <Button onClick={onClose} disabled={isLoading}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {t('save')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
