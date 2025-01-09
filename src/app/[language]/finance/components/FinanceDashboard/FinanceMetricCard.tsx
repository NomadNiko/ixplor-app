"use client";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface FinanceMetricCardProps {
  label: string;
  value: number;
  change: number;
  changeColor: string;
}

export default function FinanceMetricCard({ 
  label, 
  value, 
  change, 
  changeColor 
}: FinanceMetricCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="p-4">
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" className="mt-1">
        {formatCurrency(value)}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" className="mt-2">
        {change > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <Typography 
          variant="body2"
          color={changeColor}
        >
          {Math.abs(change)}% from last month
        </Typography>
      </Stack>
    </Card>
  );
}