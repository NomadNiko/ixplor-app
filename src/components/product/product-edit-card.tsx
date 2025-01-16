import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";
import { Product, ProductStatusEnum } from "@/app/[language]/types/product";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { Save, X, Trash2, Archive, Send, FileEdit } from "lucide-react";
import InputAdornment from "@mui/material/InputAdornment";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";
import { format } from "date-fns";
import { useForm, FormProvider, useWatch, useFormContext } from "react-hook-form";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import ButtonGroup from "@mui/material/ButtonGroup";

interface ProductFormData {
  productName: string;
  productDescription: string;
  productType: "tours" | "lessons" | "rentals" | "tickets";
  productPrice: number;
  productDuration: number | "";
  productDate: Date | null;
  productStartTime: Date | null;
  productEndTime: Date | null;
  productAdditionalInfo: string;
  productRequirements: string[];
  productImageURL: string;
  productWaiver: string;
}

interface ProductEditCardProps {
  product: Product;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: ProductStatusEnum) => Promise<void>;
}

function ProductFormFields() {
  const { t } = useTranslation("products");
  const { control, setValue } = useFormContext<ProductFormData>();
  const formData = useWatch({
    control,
    defaultValue: {
      productName: '',
      productDescription: '',
      productType: 'tours',
      productPrice: 0,
      productDuration: '',
      productDate: null,
      productStartTime: null,
      productEndTime: null,
      productAdditionalInfo: '',
      productRequirements: [],
      productImageURL: '',
      productWaiver: '',
    }
  });

  const handleRequirementsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (value) {
        setValue("productRequirements", [...(formData.productRequirements || []), value]);
        target.value = "";
      }
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const currentRequirements = formData.productRequirements || [];
    setValue(
      "productRequirements",
      currentRequirements.filter((_, i) => i !== index)
    );
  };

  return (
    <Box sx={{ display: "grid", gap: 2, mb: 3 }}>
      <TextField
        fullWidth
        label={t("productName")}
        name="productName"
        value={formData.productName}
        onChange={(e) => setValue("productName", e.target.value)}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        name="productDescription"
        label={t("productDescription")}
        value={formData.productDescription}
        onChange={(e) => setValue("productDescription", e.target.value)}
      />
      <TextField
        select
        fullWidth
        name="productType"
        label={t("productType")}
        value={formData.productType}
        onChange={(e) =>
          setValue(
            "productType",
            e.target.value as "tours" | "lessons" | "rentals" | "tickets"
          )
        }
      >
        {["tours", "lessons", "rentals", "tickets"].map((type) => (
          <MenuItem key={type} value={type}>
            {t(`productTypes.${type}`)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        type="number"
        name="productPrice"
        label={t("productPrice")}
        value={formData.productPrice}
        onChange={(e) => setValue("productPrice", Number(e.target.value))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">$</InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        type="number"
        name="productDuration"
        label={t("productDuration")}
        value={formData.productDuration}
        onChange={(e) => setValue("productDuration", Number(e.target.value))}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{t("hours")}</InputAdornment>
          ),
        }}
      />
      <FormDatePickerInput name="productDate" label={t("productDate")} />
      
      <FormTimePickerInput
        name="productStartTime"
        label={t("productStartTime")}
        format="HH:mm"
      />
      <FormTimePickerInput
        name="productEndTime"
        label={t("productEndTime")}
        format="HH:mm"
      />
      <TextField
        fullWidth
        name="productImageURL"
        label={t("productImageURL")}
        value={formData.productImageURL}
        onChange={(e) => setValue("productImageURL", e.target.value)}
      />
      <Box>
        <TextField
          fullWidth
          label={t("productRequirements")}
          placeholder={t("requirementsHelp")}
          onKeyDown={handleRequirementsChange}
        />
        {(formData.productRequirements || []).length > 0 && (
          <Box sx={{ mt: 1 }}>
            {(formData.productRequirements || []).map((req, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                }}
              >
                • {req}
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveRequirement(index)}
                >
                  <X size={14} />
                </Button>
              </Typography>
            ))}
          </Box>
        )}
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="productWaiver"
        label={t("productWaiver")}
        value={formData.productWaiver}
        onChange={(e) => setValue("productWaiver", e.target.value)}
      />
    </Box>
  );
}

export const ProductEditCard = ({
  product,
  onSave,
  onCancel,
  onDelete,
  onStatusChange
}: ProductEditCardProps) => {
  const { t } = useTranslation("products");
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const methods = useForm<ProductFormData>({
    defaultValues: {
      productName: product.productName,
      productDescription: product.productDescription,
      productType: product.productType,
      productPrice: product.productPrice,
      productDuration: product.productDuration || "",
      productDate: product.productDate ? new Date(product.productDate) : null,
      productStartTime: product.productStartTime
        ? new Date(`1970-01-01T${product.productStartTime}`)
        : null,
      productEndTime: product.productEndTime
        ? new Date(`1970-01-01T${product.productEndTime}`)
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
          <Box sx={{ 
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3 
          }}>
            <Typography variant="h5">
              {t("productEditing")}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ButtonGroup>
                <Button
                  onClick={() => handleStatusChange(ProductStatusEnum.PUBLISHED)}
                  startIcon={<Send size={16} />}
                  disabled={isSubmitting || product.productStatus === ProductStatusEnum.PUBLISHED}
                  color="success"
                >
                  {t('publish')}
                </Button>
                <Button
                  onClick={() => handleStatusChange(ProductStatusEnum.DRAFT)}
                  startIcon={<FileEdit size={16} />}
                  disabled={isSubmitting || product.productStatus === ProductStatusEnum.DRAFT}
                  color="warning"
                >
                  {t('draft')}
                </Button>
                <Button
                  onClick={() => handleStatusChange(ProductStatusEnum.ARCHIVED)}
                  startIcon={<Archive size={16} />}
                  disabled={isSubmitting || product.productStatus === ProductStatusEnum.ARCHIVED}
                  color="info"
                >
                  {t('archive')}
                </Button>
              </ButtonGroup>
              
              <Button
                color="error"
                startIcon={<Trash2 size={16} />}
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {t('delete')}
              </Button>
            </Box>
          </Box>

          <ProductFormFields />

          <Box sx={{ 
            display: "flex", 
            gap: 1, 
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
              color="primary"
              startIcon={<Save size={16} />}
              onClick={methods.handleSubmit(handleSubmit)}
              disabled={isSubmitting}
            >
              {t("save")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
};