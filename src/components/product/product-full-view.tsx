import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Edit2, Clock, DollarSign, Calendar, Clock3, Clock4 } from 'lucide-react';
import { Product } from './types/product';
import { useTranslation } from "react-i18next";
import CardMedia from "@mui/material/CardMedia";
import { ProductStatusBadge } from './product-status-badge';
import { format } from 'date-fns';
import Divider from "@mui/material/Divider";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";

interface ProductFullViewProps {
    product: Product;
    onEdit: () => void;
    onClose: () => void;
}

const ProductFullView = ({
  product,
  onEdit,
  onClose,
}: ProductFullViewProps) => {
  const { t } = useTranslation("products");
  
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box sx={{ 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        zIndex: 1200,
      }}>
        <Card>
          <ProductStatusBadge status={product.productStatus} />
          
          <Button
            startIcon={<Edit2 size={16} />}
            onClick={onEdit}
            sx={{ position: 'absolute', right: 16, top: 16, zIndex: 2 }}
          >
            {t('edit')}
          </Button>

          <Grid container>
            {/* Left Column - Image */}
            <Grid item xs={12} md={6}>
              {product.productImageURL && (
                <CardMedia
                  component="img"
                  sx={{
                    height: { xs: '200px', md: '100%' },
                    objectFit: 'cover'
                  }}
                  image={product.productImageURL}
                  alt={product.productName}
                />
              )}
            </Grid>

            {/* Right Column - Content */}
            <Grid item xs={12} md={6}>
              <CardContent sx={{ height: '100%', p: 4 }}>
                <Typography variant="h4" gutterBottom>
                  {product.productName}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {product.productDescription}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3,
                  my: 3
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
                </Box>

                {(product.productStartTime || product.productEndTime) && (
                  <Box sx={{ mb: 3 }}>
                    {product.productStartTime && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Clock3 size={20} />
                        <Typography variant="body1">
                          {t('startTime')}: {product.productStartTime}
                        </Typography>
                      </Box>
                    )}
                    {product.productEndTime && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock4 size={20} />
                        <Typography variant="body1">
                          {t('endTime')}: {product.productEndTime}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />
                
                {product.productRequirements && product.productRequirements.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {t('requirements')}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {product.productRequirements.map((req, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
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
                    <Typography variant="body2" paragraph>
                      {product.productWaiver}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </ClickAwayListener>
  );
};

export default ProductFullView;