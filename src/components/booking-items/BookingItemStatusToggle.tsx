import React from 'react';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import { Send, FileEdit, Archive } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { BookingItemStatusEnum } from '@/hooks/booking/types';
import { alpha } from '@mui/material/styles';

interface BookingItemStatusToggleProps {
  status: BookingItemStatusEnum;
  onStatusChange: (status: BookingItemStatusEnum) => Promise<void>;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const BookingItemStatusToggle: React.FC<BookingItemStatusToggleProps> = ({
  status,
  onStatusChange,
  disabled = false,
  size = 'medium'
}) => {
  const { t } = useTranslation("booking-items");

  const handleStatusChange = async (_: React.MouseEvent<HTMLElement>, newStatus: BookingItemStatusEnum | null) => {
    if (newStatus && newStatus !== status) {
      await onStatusChange(newStatus);
    }
  };

  return (
    <ToggleButtonGroup
      value={status}
      exclusive
      onChange={handleStatusChange}
      disabled={disabled}
      aria-label="booking item status"
      size={size}
      sx={{
        backgroundColor: 'background.paper',
        '& .MuiToggleButton-root': {
          borderColor: 'divider',
          '&.Mui-selected': {
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            },
          },
        },
      }}
    >
      <ToggleButton 
        value={BookingItemStatusEnum.PUBLISHED}
        aria-label="published"
        sx={{
          '&.Mui-selected': {
            color: 'success.main',
            borderColor: 'success.main',
            backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.success.main, 0.12),
            },
          },
        }}
      >
        <Send size={size === 'small' ? 14 : 16} />
        <Typography 
          variant="body2" 
          sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}
        >
          {t('status.publish')}
        </Typography>
      </ToggleButton>

      <ToggleButton 
        value={BookingItemStatusEnum.DRAFT}
        aria-label="draft"
        sx={{
          '&.Mui-selected': {
            color: 'warning.main',
            borderColor: 'warning.main',
            backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.08),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.12),
            },
          },
        }}
      >
        <FileEdit size={size === 'small' ? 14 : 16} />
        <Typography 
          variant="body2" 
          sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}
        >
          {t('status.draft')}
        </Typography>
      </ToggleButton>

      <ToggleButton 
        value={BookingItemStatusEnum.ARCHIVED}
        aria-label="archived"
        sx={{
          '&.Mui-selected': {
            color: 'error.main',
            borderColor: 'error.main',
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.12),
            },
          },
        }}
      >
        <Archive size={size === 'small' ? 14 : 16} />
        <Typography 
          variant="body2" 
          sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}
        >
          {t('status.archive')}
        </Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};