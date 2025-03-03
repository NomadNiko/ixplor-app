import Box from "@mui/material/Box";
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";
import { useTranslation } from "@/services/i18n/client";

interface ShiftTimeInputsProps {
  disabled?: boolean;
}

export default function ShiftTimeInputs({ disabled = false }: ShiftTimeInputsProps) {
  const { t } = useTranslation("staff-shifts");

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormTimePickerInput
        name="startTime"
        label={t('startTime')}
        disabled={disabled}
      />
      <FormTimePickerInput
        name="endTime"
        label={t('endTime')}
        disabled={disabled}
      />
    </Box>
  );
}