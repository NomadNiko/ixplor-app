import { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { Phone, Mail, X, Globe } from "lucide-react";
import { Image } from "@nextui-org/react";
import { useTranslation } from "@/services/i18n/client";
import { Vendor } from "@/app/[language]/types/vendor";
import { Product, ProductStatusEnum } from "@/app/[language]/types/product";
import { useGetProductsService } from "@/services/api/services/products";
import { useAddToCartService } from "@/services/api/services/cart";
import { useSnackbar } from "@/hooks/use-snackbar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useCartQuery } from '@/hooks/use-cart-query';
import useGuestCart from '@/hooks/use-guest-cart';
import useAuth from '@/services/auth/use-auth';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface VendorFullViewProps {
  vendor: Vendor;
  onClose: () => void;
}

export const VendorFullView = ({ vendor, onClose }: VendorFullViewProps) => {
  const { t } = useTranslation("vendor");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  const getProducts = useGetProductsService();
  const addToCart = useAddToCartService();
  const { refreshCart } = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { addToGuestCart } = useGuestCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response.status === HTTP_CODES_ENUM.OK && response.data) {
          const publishedProducts = response.data.data.filter(
            product => product.vendorId === vendor._id &&
                      product.productStatus === ProductStatusEnum.PUBLISHED
          );
          setProducts(publishedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        enqueueSnackbar(t('errors.loadFailed'), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [getProducts, vendor._id, enqueueSnackbar, t]);

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCart(product._id);

      // If user is logged in, use regular cart service
      if (user) {
        await addToCart({ 
          productId: product._id, 
          quantity: 1, 
          vendorId: vendor._id 
        });
        await refreshCart();
      } 
      // Otherwise use guest cart
      else {
        addToGuestCart({
          productId: product._id,
          productName: product.productName,
          productDescription: product.productDescription,
          price: product.productPrice,
          quantity: 1,
          productImageURL: product.productImageURL,
          vendorId: vendor._id,
          productType: product.productType,
          productDate: product.productDate,
          productStartTime: product.productStartTime
        });
      }
      
      enqueueSnackbar(t('success.addedToCart'), { variant: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      enqueueSnackbar(t('errors.addToCartFailed'), { variant: 'error' });
    } finally {
      setAddingToCart(null);
    }
  };

  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+ff0000(${
    vendor.location.coordinates[0]
  },${
    vendor.location.coordinates[1]
  })/${
    vendor.location.coordinates[0]
  },${
    vendor.location.coordinates[1]
  },14,0/400x200@2x?access_token=${MAPBOX_TOKEN}`;

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      padding: { xs: 1, sm: 2 },
      overflow: 'auto'
    }}>
      <Card sx={{
        maxWidth: 1000,
        margin: '0 auto',
        minHeight: '100%'
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 60, height: 60 }}>
                <Image 
                  src={vendor.logoUrl} 
                  alt={vendor.businessName}
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {vendor.businessName}
                </Typography>
                <Chip
                  label={t(`vendorTypes.${vendor.vendorTypes?.[0] || 'tours'}`)}
                  size="small"
                  color="primary"
                />
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
              <X size={16} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                {t("about")}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {vendor.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t("contact")}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={14} />
                    <Link href={`tel:${vendor.phone}`} color="inherit">{vendor.phone}</Link>
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={14} />
                    <Link href={`mailto:${vendor.email}`} color="inherit">{vendor.email}</Link>
                  </Typography>
                  {vendor.website && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Globe size={14} />
                      <Link href={vendor.website} target="_blank" rel="noopener noreferrer" color="inherit">
                        {t("visitWebsite")}
                      </Link>
                    </Typography>
                  )}
                </Box>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                {t("location")}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {vendor.address}<br />
                {vendor.city}, {vendor.state} {vendor.postalCode}
              </Typography>

              <Box sx={{ height: 200, mb: 2, borderRadius: 1, overflow: 'hidden' }}>
                <img 
                  src={staticMapUrl}
                  alt="Location map"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>

            {/* Right Column - Products */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                {t("availableProducts")}
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : products.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {products.map((product) => (
                    <Card key={product._id} variant="outlined">
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {product.productImageURL && (
                            <Box sx={{ width: 60, height: 60, flexShrink: 0 }}>
                              <Image
                                src={product.productImageURL}
                                alt={product.productName}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                            </Box>
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap>
                              {product.productName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" 
                              sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mb: 1
                              }}>
                              {product.productDescription}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="primary">
                                ${product.productPrice.toFixed(2)}
                              </Typography>
                              <Button
                                variant="contained"
                                onClick={() => handleAddToCart(product)}
                                disabled={addingToCart === product._id}
                                size="small"
                                sx={{ minWidth: 'unset', px: 1, py: 0.5 }}
                              >
                                {addingToCart === product._id ? t('addingToCart') : t('addToCart')}
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t("noProducts")}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorFullView;