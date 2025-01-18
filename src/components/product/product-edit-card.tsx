import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { format } from "date-fns";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { API_URL } from "@/services/api/config";
import { Save, X, Trash2 } from "lucide-react";
import { ProductStatusEnum } from "@/app/[language]/types/product";
import { ProductFormData, ProductEditCardProps } from "./types";
import { ProductFormFields } from "./product-form-fields";
import { ProductStatusButtons } from "./product-status-buttons";

export function ProductEditCard({
  product,
  onSave,
  onCancel,
  onDelete,
  onStatusChange
}: ProductEditCardProps) {
  const { t } = useTranslation("products");
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  // Create form with explicit defaultValues to ensure pre-filling
  const methods = useForm<ProductFormData>({
    defaultValues: {
      productName: product.productName || "",
      productDescription: product.productDescription || "",
      productType: product.productType,
      productPrice: product.productPrice || 0,
      productDuration: product.productDuration || "",
      productDate: product.productDate ? new Date(product.productDate) : null,
      productStartTime: product.productStartTime 
        ? new Date(`1970-01-01T${product.productStartTime}:00.000Z`)
        : null,
      productAdditionalInfo: product.productAdditionalInfo || "",
      productRequirements: product.productRequirements || [],
      productImageURL: product.productImageURL || "",
      productWaiver: product.productWaiver || "",
    },
  });

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = await confirmDialog({
      title: t('deleteConfirm.title'),
      message: t('deleteConfirm.message'),
      successButtonText: t('deleteConfirm.confirm'),
      cancelButtonText: t('deleteConfirm.cancel'),
    });

    if (confirmed) {
      setIsSubmitting(true);
      try {
        await onDelete(product._id);
        enqueueSnackbar(t('success.deleted'), { variant: 'success' });
        onSave();
      } catch (error) {
        console.error('Error deleting product:', error);
        enqueueSnackbar(t('errors.deleteFailed'), { variant: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStatusChange = async (newStatus: ProductStatusEnum) => {
    if (!onStatusChange || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onStatusChange(product._id, newStatus);
      enqueueSnackbar(t(`success.status.${newStatus.toLowerCase()}`), { variant: 'success' });
      onSave();
    } catch (error) {
      console.error('Error updating status:', error);
      enqueueSnackbar(t('errors.statusUpdateFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t("errors.unauthorized"), { variant: "error" });
        return;
      }

      const submissionData = {
        ...data,
        productDate: data.productDate
          ? format(data.productDate, "yyyy-MM-dd")
          : undefined,
        productStartTime: data.productStartTime
          ? format(data.productStartTime, "HH:mm")
          : undefined,
        productEndTime: data.productEndTime
          ? format(data.productEndTime, "HH:mm")
          : undefined,
        productStatus: product.productStatus,
      };

      const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        enqueueSnackbar(t("success.updated"), { variant: "success" });
        onSave();
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      enqueueSnackbar(t("errors.updateFailed"), { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t("productEditing")}
          </Typography>

          <ProductFormFields />

          <Box sx={{ 
            display: "flex", 
            flexDirection: "column",
            gap: 2,
            mt: 3
          }}>
            <Box sx={{ 
              display: "flex", 
              gap: 2,
              justifyContent: "center"
            }}>
              <ProductStatusButtons
                currentStatus={product.productStatus}
                onStatusChange={handleStatusChange}
                isSubmitting={isSubmitting}
              />
            </Box>

            <Box sx={{ 
              display: "flex", 
              gap: 2,
              justifyContent: "space-between"
            }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<Trash2 size={16} />}
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {t('delete')}
              </Button>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="inherit"
                  startIcon={<X size={16} />}
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save size={16} />}
                  onClick={methods.handleSubmit(handleSubmit)}
                  disabled={isSubmitting}
                >
                  {t("save")}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
}

export default ProductEditCard;