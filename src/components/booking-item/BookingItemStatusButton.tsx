import React from 'react';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";
import { BookingItemStatusEnum } from '@/components/booking-item/types/booking-item';

interface BookingItemStatusButtonsProps {
  currentStatus: BookingItemStatusEnum;
  onStatusChange: (status: BookingItemStatusEnum) => void;
  disabled?: boolean;
}

export const BookingItemStatusButtons = ({ currentStatus, onStatusChange, disabled = false }: BookingItemStatusButtonsProps) => {
  const { t } = useTranslation("booking-items");
  
  const buttonConfigs = [
    {
      status: BookingItemStatusEnum.DRAFT,
      label: t('status.draft'),
      color: 'warning' as const
    },
    {
      status: BookingItemStatusEnum.PUBLISHED,
      label: t('status.published'),
      color: 'success' as const
    },
    {
      status: BookingItemStatusEnum.ARCHIVED,
      label: t('status.archived'),
      color: 'error' as const
    }
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <ButtonGroup size="small" fullWidth>
        {buttonConfigs.map((config) => (
          <Button
            key={config.status}
            variant={currentStatus === config.status ? "contained" : "outlined"}
            color={config.color}
            onClick={() => onStatusChange(config.status)}
            disabled={disabled || currentStatus === config.status}
            sx={{
              opacity: currentStatus === config.status ? 1 : 0.7,
              '&:hover': {
                opacity: 1
              }
            }}
          >
            {config.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default BookingItemStatusButtons;