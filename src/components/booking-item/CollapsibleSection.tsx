import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BookingItem, BookingItemStatusEnum } from './types/booking-item';
import { BookingItemCard } from './BookingItemCard';

interface CollapsibleSectionProps {
  title: string;
  items: BookingItem[];
  defaultOpen?: boolean;
  badgeColor: 'success' | 'warning' | 'error';
  onItemClick: (id: string) => void;
  onStatusChange: (itemId: string, status: BookingItemStatusEnum) => Promise<void>;
  updatingItemId: string | null;
}

export const CollapsibleSection = ({
  title,
  items,
  defaultOpen = false,
  badgeColor,
  onItemClick,
  onStatusChange,
  updatingItemId
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        fullWidth
        sx={{
          justifyContent: 'space-between',
          py: 1.5,
          px: 2,
          mb: 2,
          backgroundColor: theme => `${theme.palette[badgeColor].main}15`,
          '&:hover': {
            backgroundColor: theme => `${theme.palette[badgeColor].main}25`,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" color={badgeColor}>
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: theme => theme.palette[badgeColor].main,
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            {items.length}
          </Box>
        </Box>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </Button>

      {isOpen && (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <BookingItemCard
                item={item}
                onClick={() => onItemClick(item._id)}
                onStatusChange={onStatusChange}
                isUpdatingStatus={updatingItemId === item._id}
              />
            </Grid>
          ))}
          {items.length === 0 && (
            <Grid item xs={12}>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                align="center"
                sx={{ py: 4 }}
              >
                No items in this section
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};