import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Save, X } from 'lucide-react';
import { useTheme } from "@mui/material/styles";

interface VendorEditActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  t: (key: string) => string;
}

export const VendorEditActions: React.FC<VendorEditActionsProps> = ({
  onSave,
  onCancel,
  isSubmitting,
  t
}) => {
  const theme = useTheme();
  return (
    <Box sx={{
      display: "flex",
      gap: 1,
      mt: 2,
      justifyContent: "flex-end"
    }}>
      <Button
        variant="contained"
        color="error"
        startIcon={<X size={16} />}
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {t("cancel")}
      </Button>
      <Button
        variant="contained"
        startIcon={<Save size={16} />}
        onClick={onSave}
        disabled={isSubmitting}
        sx={{ background: theme.palette.success.main }}
      >
        {t("save")}
      </Button>
    </Box>
  );
};