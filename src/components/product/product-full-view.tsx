import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, MoreVertical, Clock, DollarSign, Calendar, Clock3, Clock4 } from 'lucide-react';
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { Product, ProductStatusEnum } from './types/product';
import { useTranslation } from "react-i18next";
import CardMedia from "@mui/material/CardMedia";
import { ProductStatusBadge } from './product-status-badge';
import { format } from 'date-fns';
import Divider from "@mui/material/Divider";
import ClickAwayListener from "@mui/material/ClickAwayListener";

interface ProductFullViewProps {
    product: Product;
    onStatusChange: (id: string, status: ProductStatusEnum) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit: () => void;
    onClose: () => void;
    onUpdate?: () => Promise<void>;
}

export const ProductFullView = ({
  product,
  onStatusChange,
  onDelete,
  onEdit,
  onClose,
  onUpdate
}: ProductFullViewProps) => {
  const { t } = useTranslation("products");
  const { confirmDialog } = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event?: React.MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const confirmed = await confirmDialog({
      title: t('deleteConfirm.title'),
      message: t('deleteConfirm.message'),
      successButtonText: t('deleteConfirm.confirm'),
      cancelButtonText: t('deleteConfirm.cancel'),
    });
    if (confirmed) {
      setIsSubmitting(true);
      await onDelete(product._id);
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: ProductStatusEnum) => {
    if (isSubmitting) return;
    handleMenuClose();
    
    try {
      setIsSubmitting(true);
      await onStatusChange(product._id, newStatus);
      
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onEdit();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Card ref={cardRef} sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        maxWidth: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <ProductStatusBadge status={product.productStatus} />
        
        {product.productImageURL && (
          <CardMedia
            component="img"
            height="300"
            image={product.productImageURL}
            alt={product.productName}
            sx={{ objectFit: 'cover' }}
          />
        )}
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            {product.productName}
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {product.productDescription}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3, 
            mb: 3,
            mt: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DollarSign size={20} />
              <Typography variant="h6">
                {product.productPrice.toFixed(2)}
              </Typography>
            </Box>
            
            {product.productDuration && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={20} />
                <Typography variant="h6">
                  {product.productDuration} {t('hours')}
                </Typography>
              </Box>
            )}

            {product.productDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={20} />
                <Typography variant="h6">
                  {format(new Date(product.productDate), 'PPP')}
                </Typography>
              </Box>
            )}

            {product.productStartTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock3 size={20} />
                <Typography variant="h6">
                  {t('startTime')}: {product.productStartTime}
                </Typography>
              </Box>
            )}

            {product.productEndTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock4 size={20} />
                <Typography variant="h6">
                  {t('endTime')}: {product.productEndTime}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />
          
          {product.productRequirements && product.productRequirements.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                {t('requirements')}
              </Typography>
              <Box sx={{ mb: 3 }}>
                {product.productRequirements.map((req, index) => (
                  <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                    • {req}
                  </Typography>
                ))}
              </Box>
            </>
          )}

          {product.productWaiver && (
            <>
              <Typography variant="h6" gutterBottom>
                {t('waiver')}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.productWaiver}
              </Typography>
            </>
          )}

          {product.productAdditionalInfo && (
            <>
              <Typography variant="h6" gutterBottom>
                {t('additionalInfo')}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.productAdditionalInfo}
              </Typography>
            </>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('created')}: {format(new Date(product.createdAt), 'PPP')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('lastUpdated')}: {format(new Date(product.updatedAt), 'PPP')}
            </Typography>
          </Box>
        </CardContent>
        
        <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button
            startIcon={<Edit2 size={16} />}
            onClick={handleEditClick}
            disabled={isSubmitting}
          >
            {t('edit')}
          </Button>
          
          <Button
            color="error"
            startIcon={<Trash2 size={16} />}
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {t('delete')}
          </Button>
          
          <IconButton
            onClick={handleMenuOpen}
            disabled={isSubmitting}
          >
            <MoreVertical size={16} />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleMenuClose()}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem
              onClick={() => handleStatusChange(ProductStatusEnum.PUBLISHED)}
              disabled={product.productStatus === ProductStatusEnum.PUBLISHED}
            >
              {t('publish')}
            </MenuItem>
            <MenuItem
              onClick={() => handleStatusChange(ProductStatusEnum.DRAFT)}
              disabled={product.productStatus === ProductStatusEnum.DRAFT}
            >
              {t('draft')}
            </MenuItem>
            <MenuItem
              onClick={() => handleStatusChange(ProductStatusEnum.ARCHIVED)}
              disabled={product.productStatus === ProductStatusEnum.ARCHIVED}
            >
              {t('archive')}
            </MenuItem>
          </Menu>
        </CardActions>
      </Card>
    </ClickAwayListener>
  );
};