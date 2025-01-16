import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { formatDistance } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { Clock, DollarSign, Edit2 } from 'lucide-react';
import { Product, ProductStatusEnum } from '@/app/[language]/types/product';
import { ProductStatusBadge } from './product-status-badge';
import { useState } from 'react';
import { ProductEditCard } from './product-edit-card';

interface ProductCardProps {
  product: Product;
  onStatusChange?: (id: string, status: ProductStatusEnum) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: () => Promise<void>;
}

export const ProductCard = ({ 
  product, 
  onUpdate 
}: ProductCardProps) => {
  const { t } = useTranslation("products");
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ProductEditCard
        product={product}
        onSave={async () => {
          setIsEditing(false);
          if (onUpdate) {
            await onUpdate();
          }
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

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
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mt: 2
        }}>
          <Typography variant="caption" color="text.secondary">
            {t('created')} {formatDistance(new Date(product.createdAt), new Date(), { addSuffix: true })}
          </Typography>
          
          <Button
            startIcon={<Edit2 size={16} />}
            onClick={() => setIsEditing(true)}
            size="small"
          >
            {t('edit')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};