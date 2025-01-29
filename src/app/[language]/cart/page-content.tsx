// src/app/[language]/cart/page-content.tsx
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

export default function CartPage() {
  const { t } = useTranslation("cart");
  const { data: cartData, isLoading, refreshCart } = useCartQuery();
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.replace('/sign-in');
        return;
      }
    }
  }, [isLoaded, user, router]);

  if (isLoading) {
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

  const subtotal = cartData?.items.reduce(
    (sum: number, item: CartItemType) => sum + item.price * item.quantity,
    0
  ) ?? 0;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {!cartData?.items.length ? (
            <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
              {t("emptyCart")}
            </Typography>
          ) : (
            cartData.items.map((item: CartItemType) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdate={refreshCart}
              />
            ))
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box position="sticky" top={24}>
            <CartSummary total={subtotal} />
            {cartData?.items.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ mt: 2 }}
              >
                {t("actions.checkout")}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}