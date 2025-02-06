import { useRouter } from 'next/navigation';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { formatDistance, format } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { ProductItem, ProductItemStatus, StatusColor } from './types/product-item.types';

interface ProductItemCardProps {
  item: ProductItem;
  onUpdateStatus: (itemId: string, newStatus: ProductItemStatus) => Promise<void>;
}

export const ProductItemCard: React.FC<ProductItemCardProps> = ({ item, onUpdateStatus }) => {
  const { t } = useTranslation("product-items");
  const router = useRouter();

  const getStatusColor = (status: string): StatusColor => {
    switch (status) {
      case ProductItemStatus.ACTIVE:
        return 'success';
      case ProductItemStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEdit = () => {
    router.push(`/product-items/${item._id}/edit`);
  };

  return (
    <Card>
      {item.imageURL && (
        <CardMedia
          component="img"
          height="200"
          image={item.imageURL}
          alt={item.templateName}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {item.templateName}
          </Typography>
          <Chip
            label={t(`status.${item.itemStatus.toLowerCase()}`)}
            color={getStatusColor(item.itemStatus)}
            size="small"
          />
        </Box>

        <Typography color="text.secondary" paragraph>
          {item.description}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('date')}
            </Typography>
            <Typography>
              {format(new Date(item.productDate), 'PPP')}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('time')}
            </Typography>
            <Typography>{item.startTime}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('duration')}
            </Typography>
            <Typography>
              {item.duration} {t('minutes')}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('price')}
            </Typography>
            <Typography>${item.price.toFixed(2)}</Typography>
          </Box>
        </Box>

        {(item.instructorName || item.tourGuide || item.equipmentSize) && (
          <Box sx={{ mb: 2 }}>
            {item.instructorName && (
              <Typography variant="body2">
                {t('instructorName')}: {item.instructorName}
              </Typography>
            )}
            {item.tourGuide && (
              <Typography variant="body2">
                {t('tourGuide')}: {item.tourGuide}
              </Typography>
            )}
            {item.equipmentSize && (
              <Typography variant="body2">
                {t('equipmentSize')}: {item.equipmentSize}
              </Typography>
            )}
          </Box>
        )}

        {item.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.notes}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          {t('updated')} {formatDistance(new Date(item.updatedAt), new Date(), { addSuffix: true })}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={handleEdit}
        >
          {t('actions.edit')}
        </Button>
        {item.itemStatus === ProductItemStatus.ACTIVE && (
          <Button
            size="small"
            color="error"
            onClick={() => onUpdateStatus(item._id, ProductItemStatus.CANCELLED)}
          >
            {t('actions.cancel')}
          </Button>
        )}
        {item.itemStatus === ProductItemStatus.CANCELLED && (
          <Button
            size="small"
            color="success"
            onClick={() => onUpdateStatus(item._id, ProductItemStatus.ACTIVE)}
          >
            {t('actions.reactivate')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};