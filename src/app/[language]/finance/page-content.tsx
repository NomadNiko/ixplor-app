"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Dynamically import the dashboard to avoid SSR issues with charts
const FinanceDashboard = dynamic(
  () => import('./components/FinanceDashboard'),
  {
    loading: () => (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

export default function FinanceContent() {
  return (
    <Suspense
      fallback={
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      }
    >
      <FinanceDashboard />
    </Suspense>
  );
}