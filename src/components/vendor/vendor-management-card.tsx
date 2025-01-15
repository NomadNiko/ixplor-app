import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useTranslation } from "@/services/i18n/client";
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";
import { Check, X, AlertTriangle, Trash2 } from "lucide-react";
import { Image } from "@nextui-org/react";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import Divider from "@mui/material/Divider";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useTheme } from "@mui/material/styles";

interface VendorManagementCardProps {
  vendor: Vendor;
  onAction: (
    id: string,
    action: VendorStatusEnum,
    notes: string
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const VendorManagementCard: React.FC<VendorManagementCardProps> = ({
  vendor,
  onAction,
  onDelete,
}) => {
  const { t } = useTranslation("vendor-admin");
  const { enqueueSnackbar } = useSnackbar();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();
  const theme = useTheme();

  const handleAction = async (action: VendorStatusEnum) => {
    if (isSubmitting) return;

    if (
      (action === VendorStatusEnum.REJECTED ||
        action === VendorStatusEnum.ACTION_NEEDED) &&
      !notes.trim()
    ) {
      enqueueSnackbar(t("errors.notesRequired"), { variant: "error" });
      return;
    }

    setIsSubmitting(true);
    await onAction(vendor._id, action, notes);
    setIsSubmitting(false);
    setNotes("");
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: t("deleteConfirm.title"),
      message: t("deleteConfirm.message"),
      successButtonText: t("deleteConfirm.confirm"),
      cancelButtonText: t("deleteConfirm.cancel"),
    });

    if (confirmed) {
      setIsSubmitting(true);
      await onDelete(vendor._id);
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent sx={{ position: "relative" }}>
      
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: 100 },
              height: { xs: 100, sm: 100 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Image
              src={vendor.logoUrl}
              alt={vendor.businessName}
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              {vendor.businessName}
            </Typography>

            <Typography
              color="text.secondary"
              component="p"
              variant="body2"
              sx={{ mb: 2 }}
            >
              {vendor.description}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
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
                <Typography>
                  {vendor.city}, {vendor.state} {vendor.postalCode}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="success.light">
                  {t("status")}
                </Typography>
                <Typography color="warning.main">
                  {vendor.vendorStatus.toUpperCase()}
                </Typography>
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

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            sx={{ background: theme.palette.success.main }}
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
            sx={{
              background: theme.palette.error.main,
              ml: "auto",
            }}
            startIcon={<Trash2 size={16} />}
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {t("delete")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
