import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { formatDistance } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { Clock, DollarSign } from 'lucide-react';
import { Product } from '../../app/[language]/types/product';

export const ProductStatusBadge = ({ status }: { status: Product['productStatus'] }) => {
  const { t } = useTranslation("products");
  
  const getStatusColor = (status: Product['productStatus']) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      size="small"
      label={t(`status.${status.toLowerCase()}`)}
      color={getStatusColor(status)}
      sx={{ position: 'absolute', top: 8, right: 8 }}
    />
  );
};

export const ProductCard: React.FC<{
  product: Product;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: () => void;
  onStatusChange?: (id: string, status: Product['productStatus']) => Promise<void>;
}> = ({ product }) => {
  const { t } = useTranslation("products");

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ProductStatusBadge status={product.productStatus} />
      
      {product.productImageURL && (
        <CardMedia
          component="img"
          height="140"
          image={product.productImageURL}
          alt={product.productName}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {product.productName}
        </Typography>
        
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {product.productDescription}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DollarSign size={16} />
            <Typography>
              {product.productPrice.toFixed(2)}
            </Typography>
          </Box>
          
          {product.productDuration && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock size={16} />
              <Typography>
                {product.productDuration} {t('hours')}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {t('created')} {formatDistance(new Date(product.createdAt), new Date(), { addSuffix: true })}
        </Typography>
      </CardContent>
    </Card>
  );
};