"use client";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import BillingDetails from "@/components/cart/billing-details";
import PaymentMethods from "@/components/cart/payment-methods";
import ProductQuickAdd from "@/components/cart/product-quick-add";
import { useGetCartService } from "@/services/api/services/cart";
import { useSnackbar } from "@/hooks/use-snackbar";
import { CartItemType } from "./types";
import useAuth from "@/services/auth/use-auth";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { t } = useTranslation("cart");
  const { enqueueSnackbar } = useSnackbar();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  
  const getCart = useGetCartService();

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCartItems(response.items);
    } catch (error) {
      console.error('Error loading cart:', error);
      enqueueSnackbar(t('errors.loadCartFailed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.replace('/sign-in');
        return;
      }
      loadCart();
    }
  }, [isLoaded, user]);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>

      <ProductQuickAdd onUpdate={loadCart} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box mb={4}>
            {cartItems.length === 0 ? (
              <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
                {t("emptyCart")}
              </Typography>
            ) : (
              cartItems.map(item => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdate={loadCart}
                />
              ))
            )}
          </Box>
          
          <BillingDetails />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box position="sticky" top={24}>
            <CartSummary total={subtotal} />
            <Box mt={2}>
              <PaymentMethods />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}