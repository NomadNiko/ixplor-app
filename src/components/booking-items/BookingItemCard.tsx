import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { Clock, DollarSign, Edit2 } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { BookingItem, BookingItemStatusEnum } from '@/hooks/booking/types';
import { BookingItemStatusToggle } from './BookingItemStatusToggle';

interface BookingItemCardProps {
  item: BookingItem;
  onEdit: () => void;
  onStatusChange: (status: BookingItemStatusEnum) => Promise<void>;
}

export const BookingItemCard: React.FC<BookingItemCardProps> = ({
  item,
  onEdit,
  onStatusChange,
}) => {
  const { t } = useTranslation("booking-items");

  const getStatusColor = (status: BookingItemStatusEnum): "success" | "warning" | "error" => {
    switch (status) {
      case BookingItemStatusEnum.PUBLISHED:
        return 'success';
      case BookingItemStatusEnum.DRAFT:
        return 'warning';
      case BookingItemStatusEnum.ARCHIVED:
        return 'error';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {item.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={item.imageUrl}
          alt={item.productName}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2 
        }}>
          <Typography variant="h6">
            {item.productName}
          </Typography>
          <Chip
            size="small"
            label={t(`status.${item.status.toLowerCase()}`)}
            color={getStatusColor(item.status)}
          />
        </Box>

        <Typography color="text.secondary" paragraph>
          {item.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DollarSign size={16} />
            <Typography>
              {item.price.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Clock size={16} />
            <Typography>
              {item.duration} {t('minutes')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mt: 'auto'
        }}>
          <BookingItemStatusToggle
            status={item.status}
            onStatusChange={onStatusChange}
          />
          <Button
            variant="outlined"
            startIcon={<Edit2 size={16} />}
            onClick={onEdit}
          >
            {t('edit')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};