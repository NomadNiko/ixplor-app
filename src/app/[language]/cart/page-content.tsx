"use client";
import { useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import useAuth from "@/services/auth/use-auth";
import { useRouter } from "next/navigation";
import { useCartQuery } from "@/hooks/use-cart-query";
import { CartItemType } from "./types";
import useGuestCart from "@/hooks/use-guest-cart";
import Link from "@/components/link";
import { useSnackbar } from "@/hooks/use-snackbar";

export default function CartPage() {
  const { t } = useTranslation("cart");
  const { data: cartData, isLoading: isCartLoading, refreshCart } = useCartQuery();
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { 
    guestCart, 
    updateGuestCartItem, 
    removeFromGuestCart,
    isGuest 
  } = useGuestCart();

  // Redirect to sign-in if trying to access cart while not authenticated
  useEffect(() => {
    if (!user && !isGuest && isLoaded) {
      router.replace('/sign-in');
    }
  }, [isLoaded, user, router, isGuest]);

  // Calculate total based on whether user is logged in or guest
  const calculateTotal = () => {
    if (isGuest) {
      return guestCart.reduce(
        (sum: number, item: CartItemType) => sum + item.price * item.quantity,
        0
      );
    }
    return cartData?.items.reduce(
      (sum: number, item: CartItemType) => sum + item.price * item.quantity,
      0
    ) ?? 0;
  };

  // Handle cart item quantity updates
  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (isGuest) {
      updateGuestCartItem(productId, newQuantity);
      enqueueSnackbar(t('success.quantityUpdated'), { variant: 'success' });
    } else {
      refreshCart();
    }
  };

  // Handle cart item removal
  const handleRemoveItem = (productId: string) => {
    if (isGuest) {
      removeFromGuestCart(productId);
      enqueueSnackbar(t('success.itemRemoved'), { variant: 'success' });
    } else {
      refreshCart();
    }
  };

  // Handle checkout button click
  const handleCheckout = () => {
    if (isGuest) {
      router.push('/sign-in?returnTo=/checkout');
      return;
    }
    router.push('/checkout');
  };

  // Loading state
  if (isCartLoading && !isGuest) {
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

  // Get cart items based on auth state
  const cartItems = isGuest ? guestCart : cartData?.items || [];
  const total = calculateTotal();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {!cartItems.length ? (
            <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
              {t("emptyCart")}
            </Typography>
          ) : (
            cartItems.map((item: CartItemType) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdate={handleQuantityUpdate}
                onRemove={handleRemoveItem}
                isGuest={isGuest}
              />
            ))
          )}

          {/* Guest User Notice */}
          {isGuest && cartItems.length > 0 && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {t("guestCartNotice")}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  href="/sign-in"
                  variant="contained"
                  color="primary"
                >
                  {t("signIn")}
                </Button>
                <Button
                  component={Link}
                  href="/sign-up"
                  variant="outlined"
                  color="primary"
                >
                  {t("signUp")}
                </Button>
              </Box>
            </Box>
          )}
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              position: "sticky", 
              top: 24,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1
            }}
          >
            <CartSummary total={total} />
            
            {cartItems.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ mt: 2 }}
              >
                {isGuest ? t("signInToCheckout") : t("actions.checkout")}
              </Button>
            )}
            
            <Typography 
              variant="caption" 
              color="text.secondary" 
              display="block" 
              align="center"
              sx={{ mt: 2 }}
            >
              {t("noAdditionalFees")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}