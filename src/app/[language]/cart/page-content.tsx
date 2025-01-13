"use client";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import BillingDetails from "@/components/cart/billing-details";
import PaymentMethods from "@/components/cart/payment-methods";
import { mockCartItems } from "@/components/mock-data/cart-items";
import { useState } from "react";
import Box from "@mui/material/Box";
import { CartItemType } from "./types";

export default function CartPage() {
  const { t } = useTranslation("cart");
  const [cartItems, setCartItems] = useState<CartItemType[]>(mockCartItems);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box mb={4}>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </Box>
          
          <BillingDetails />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box position="sticky" top={24}>
            <CartSummary
              subtotal={subtotal}
              tax={tax}
              total={total}
            />
            <Box mt={2}>
              <PaymentMethods />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}