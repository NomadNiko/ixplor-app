import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { Edit2, Trash2, MoreVertical, DollarSign, Clock } from "lucide-react";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { ProductStatusBadge } from "./product-status-badge";
import { Product } from "./types/product";
import { useTranslation } from "react-i18next";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ProductStatusEnum } from "@/app/[language]/types/product";

export const ProductManagementCard: React.FC<{
  product: Product;
  onDelete: (id: string) => Promise<void>;
  onEdit: () => void;
  onStatusChange: (
    id: string,
    status: Product["productStatus"]
  ) => Promise<void>;
}> = ({ product, onDelete, onEdit, onStatusChange }) => {
  const { t } = useTranslation("products");
  const { confirmDialog } = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (newStatus: ProductStatusEnum) => {
    if (isSubmitting) return;

    handleMenuClose();
    setIsSubmitting(true);
    await onStatusChange(product._id, newStatus);
    setIsSubmitting(false);
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
      await onDelete(product._id);
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <ProductStatusBadge status={product.productStatus} />

      {product.productImageURL && (
        <CardMedia
          component="img"
          height="140"
          image={product.productImageURL}
          alt={product.productName}
          sx={{ objectFit: "cover" }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {product.productName}
        </Typography>

        <Typography color="text.secondary" paragraph>
          {product.productDescription}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <DollarSign size={16} />
            <Typography>{product.productPrice.toFixed(2)}</Typography>
          </Box>

          {product.productDuration && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={16} />
              <Typography>
                {product.productDuration} {t("hours")}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button
          startIcon={<Edit2 size={16} />}
          onClick={onEdit}
          disabled={isSubmitting}
        >
          {t("edit")}
        </Button>

        <Button
          color="error"
          startIcon={<Trash2 size={16} />}
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {t("delete")}
        </Button>

        <IconButton onClick={handleMenuOpen} disabled={isSubmitting}>
          <MoreVertical size={16} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => handleStatusChange(ProductStatusEnum.PUBLISHED)}
            disabled={product.productStatus === ProductStatusEnum.PUBLISHED}
          >
            {t("publish")}
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange(ProductStatusEnum.DRAFT)}
            disabled={product.productStatus === ProductStatusEnum.DRAFT}
          >
            {t("draft")}
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange(ProductStatusEnum.ARCHIVED)}
            disabled={product.productStatus === ProductStatusEnum.ARCHIVED}
          >
            {t("archive")}
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
};
