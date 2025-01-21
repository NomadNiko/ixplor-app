// src/components/cart/cart-item.tsx
import { useState } from 'react';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Minus, Plus, X } from "lucide-react";
import { CartItemType } from "@/app/[language]/cart/types";
import { useTranslation } from "@/services/i18n/client";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { useUpdateCartItemService, useRemoveFromCartService } from "@/services/api/services/cart";
import { useSnackbar } from "@/hooks/use-snackbar";

type CartItemProps = {
  item: CartItemType;
  onUpdate: () => void;
};

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const { t } = useTranslation("cart");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateCartItem = useUpdateCartItemService();
  const removeFromCart = useRemoveFromCartService();

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      setLoading(true);
      await updateCartItem({
        productId: item.productId,
        quantity: newQuantity,
      });
      onUpdate();
      enqueueSnackbar(t('success.quantityUpdated'), { variant: 'success' });
    } catch (error) {
      console.error('Error updating quantity:', error);
      enqueueSnackbar(t('errors.updateFailed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      await removeFromCart(item.productId);
      onUpdate();
      enqueueSnackbar(t('success.itemRemoved'), { variant: 'success' });
    } catch (error) {
      console.error('Error removing item:', error);
      enqueueSnackbar(t('errors.removeFailed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent 
        sx={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          alignItems: "center", 
          gap: isMobile ? 1 : 2,
          position: "relative",
          px: isMobile ? 1 : 2,
          py: isMobile ? 1 : 2
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 1,
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {isMobile && (
          <IconButton 
            onClick={handleRemove}
            disabled={loading}
            sx={{ 
              position: "absolute", 
              top: 4, 
              right: 4, 
              zIndex: 1 
            }}
          >
            <X size={16} />
          </IconButton>
        )}

        {item.productImageURL && (
          <Box
            component="img"
            src={item.productImageURL}
            alt={item.productName}
            sx={{
              width: isMobile ? 80 : 100,
              height: isMobile ? 80 : 100,
              objectFit: "cover",
              borderRadius: 1,
              mb: isMobile ? 1 : 0
            }}
          />
        )}
        
        <Box 
          flex={1} 
          sx={{ 
            width: "100%", 
            textAlign: isMobile ? "center" : "left",
            mb: isMobile ? 1 : 0
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            {item.productName}
          </Typography>
          {item.productDate && (
            <Typography variant={isMobile ? "caption" : "body2"}>
              {t("date")}: {new Date(item.productDate).toLocaleDateString()}
            </Typography>
          )}
          {item.productStartTime && (
            <Typography variant={isMobile ? "caption" : "body2"}>
              {t("time")}: {item.productStartTime}
            </Typography>
          )}
        </Box>

        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: 1,
            mb: isMobile ? 1 : 0
          }}
        >
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(Math.max(0, item.quantity - 1))}
            disabled={loading}
          >
            <Minus size={16} />
          </IconButton>
          <Typography variant={isMobile ? "body2" : "body1"}>
            {item.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={loading}
          >
            <Plus size={16} />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: isMobile ? "center" : "right", minWidth: isMobile ? "100%" : 100 }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
            ${item.price.toFixed(2)} {t("each")}
          </Typography>
        </Box>

        {!isMobile && (
          <IconButton onClick={handleRemove} disabled={loading}>
            <X size={16} />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
}