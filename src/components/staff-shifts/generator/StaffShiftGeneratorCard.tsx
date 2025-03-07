import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";
import { useStaffShifts } from '@/hooks/use-staff-shifts';
import { useSnackbar } from '@/hooks/use-snackbar';
import ShiftCalendarSelector from './ShiftCalendarSelector';
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";
import { useForm, FormProvider } from 'react-hook-form';

interface StaffShiftGeneratorCardProps {
  staffId: string;
  staffName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  selectedDates: Date[];
  startTime: Date | null;
  endTime: Date | null;
}

export default function StaffShiftGeneratorCard({
    staffId,
    staffName,
    onSuccess,
    onCancel
  }: StaffShiftGeneratorCardProps) {
    const { t } = useTranslation("staff-shifts");
    const { enqueueSnackbar } = useSnackbar();
    const { createShifts, isLoading } = useStaffShifts();
    const methods = useForm<FormData>({
      defaultValues: {
        selectedDates: [],
        startTime: null,
        endTime: null
      }
    });
  
    const handleSubmit = async (data: FormData) => {
      if (!data.startTime || !data.endTime || data.selectedDates.length === 0) {
        return;
      }
  
      try {
        // Extract hours and minutes from the time objects
        const startHours = data.startTime.getHours();
        const startMinutes = data.startTime.getMinutes();
        const endHours = data.endTime.getHours();
        const endMinutes = data.endTime.getMinutes();
        
        const shifts = data.selectedDates.map(date => {
          // Create new Date objects with the correct date and time components
          const startDateTime = new Date(date);
          startDateTime.setHours(startHours, startMinutes, 0, 0);
          
          const endDateTime = new Date(date);
          endDateTime.setHours(endHours, endMinutes, 0, 0);
          
          return {
            startDateTime,
            endDateTime
          };
        });
  
        await createShifts(staffId, shifts);
        enqueueSnackbar(t('success.shiftsCreated'), { variant: 'success' });
        onSuccess();
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error ? error.message : t('errors.createFailed'),
          { variant: 'error' }
        );
      }
    };
  
    return  (
    <FormProvider {...methods}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t('generateShifts')} - {staffName}
          </Typography>

          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('selectDates')}
              </Typography>
              <ShiftCalendarSelector />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormTimePickerInput
                name="startTime"
                label={t('startTime')}
              />
              <FormTimePickerInput
                name="endTime"
                label={t('endTime')}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
              >
                {t('generate')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}