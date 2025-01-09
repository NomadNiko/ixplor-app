
"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";

const LoadingSpinner = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="60vh"
  >
    <CircularProgress />
  </Box>
);

// Dynamically import the dashboard to avoid SSR issues with charts
const FinanceDashboard = dynamic(
  () => import('./components/FinanceDashboard'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

// Move the auth wrapper to the client component
function FinanceContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FinanceDashboard />
    </Suspense>
  );
}

// Apply the auth wrapper here instead of in the page
export default withPageRequiredAuth(FinanceContent);