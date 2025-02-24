import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Clock, DollarSign } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { BookingItem, BookingItemStatusEnum } from './types/booking-item';
import BookingItemStatusButtons from "./BookingItemStatusButton";

interface BookingItemCardProps {
  item: BookingItem;
  onClick: () => void;
  onStatusChange: (itemId: string, status: BookingItemStatusEnum) => Promise<void>;
  isUpdatingStatus?: boolean;
}

export const BookingItemCard = ({ 
  item, 
  onClick, 
  onStatusChange,
  isUpdatingStatus = false 
}: BookingItemCardProps) => {
  const { t } = useTranslation("booking-items");

  const getStatusColor = (status: BookingItemStatusEnum): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case BookingItemStatusEnum.PUBLISHED:
        return 'success';
      case BookingItemStatusEnum.DRAFT:
        return 'warning';
      case BookingItemStatusEnum.ARCHIVED:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}min`;
    if (remainingMinutes === 0) return `${hours}hr`;
    return `${hours}hr ${remainingMinutes}min`;
  };

  const handleStatusChange = async (newStatus: BookingItemStatusEnum) => {
    if (newStatus !== item.status) {
      await onStatusChange(item._id, newStatus);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking buttons
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <Box 
        onClick={onClick}
        sx={{ 
          cursor: 'pointer',
          flex: 1,
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.2s ease-in-out'
          }
        }}
      >
        {item.imageUrl && (
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.productName}
            sx={{
              width: '100%',
              height: 140,
              objectFit: 'cover'
            }}
          />
        )}
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {item.productName}
            </Typography>
            <Chip
              label={t(`status.${item.status.toLowerCase()}`)}
              color={getStatusColor(item.status)}
              size="small"
            />
          </Box>
          
          <Typography color="text.secondary" noWrap sx={{ mb: 2 }}>
            {item.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DollarSign size={16} />
              <Typography>
                {item.price.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock size={16} />
              <Typography>
                {formatDuration(item.duration)}
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary">
            {t('updated')} {formatDistance(new Date(item.updatedAt), new Date(), { addSuffix: true })}
          </Typography>
        </CardContent>
      </Box>

      {/* Status Buttons in a separate non-clickable section */}
      <Box onClick={handleButtonClick} sx={{ px: 2, pb: 2 }}>
        <BookingItemStatusButtons
          currentStatus={item.status}
          onStatusChange={handleStatusChange}
          disabled={isUpdatingStatus}
        />
      </Box>
    </Card>
  );
};