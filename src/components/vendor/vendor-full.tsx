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
import { Phone, Mail, X, Globe, MapPin } from "lucide-react";
import { Image } from "@nextui-org/react";
import { useTranslation } from "@/services/i18n/client";
import { Vendor } from "@/app/[language]/types/vendor";
import Map, { Marker } from 'react-map-gl';
import { useGetProductsService } from "@/services/api/services/products";
import { Product, ProductStatusEnum } from "@/app/[language]/types/product";
import { useAddToCartService } from "@/services/api/services/cart";
import { useSnackbar } from "@/hooks/use-snackbar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";

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
  const { enqueueSnackbar } = useSnackbar();

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

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      await addToCart({
        productId,
        quantity: 1,
      });
      enqueueSnackbar(t('success.addedToCart'), { variant: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      enqueueSnackbar(t('errors.addToCartFailed'), { variant: 'error' });
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <Card sx={{ 
      width: "100%",
      mt: 2,
      mb: 2
    }}>
        <CardContent>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 3 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Image 
                src={vendor.logoUrl} 
                alt={vendor.businessName}
                style={{ 
                  maxWidth: '80px',
                  maxHeight: '80px',
                  objectFit: 'contain'
                }}
              />
              <Box>
                <Typography variant="h4" gutterBottom>
                  {vendor.businessName}
                </Typography>
                <Chip
                  label={t(`vendorTypes.${vendor.vendorTypes?.[0] || 'tours'}`)}
                  size="small"
                  color="primary"
                />
              </Box>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{ color: 'text.secondary' }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {t("about")}
              </Typography>
              <Typography color="text.secondary" paragraph>
                {vendor.description}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {t("contact")}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography 
                    color="text.secondary" 
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Phone size={16} />
                    <Link href={`tel:${vendor.phone}`} color="inherit">
                      {vendor.phone}
                    </Link>
                  </Typography>
                  <Typography 
                    color="text.secondary" 
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Mail size={16} />
                    <Link href={`mailto:${vendor.email}`} color="inherit">
                      {vendor.email}
                    </Link>
                  </Typography>
                  {vendor.website && (
                    <Typography 
                      color="text.secondary" 
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Globe size={16} />
                      <Link 
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="inherit"
                      >
                        {t("visitWebsite")}
                      </Link>
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Location Map */}
              <Typography variant="h6" gutterBottom>
                {t("location")}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {vendor.address}<br />
                {vendor.city}, {vendor.state} {vendor.postalCode}
              </Typography>
              <Box sx={{ height: 200, mb: 3, borderRadius: 1, overflow: 'hidden' }}>
                <Map
                  mapboxAccessToken={MAPBOX_TOKEN}
                  initialViewState={{
                    longitude: vendor.location.coordinates[0],
                    latitude: vendor.location.coordinates[1],
                    zoom: 14
                  }}
                  style={{ width: '100%', height: '100%' }}
                  mapStyle="mapbox://styles/mapbox/dark-v11"
                >
                  <Marker
                    longitude={vendor.location.coordinates[0]}
                    latitude={vendor.location.coordinates[1]}
                    anchor="bottom"
                  >
                    <MapPin color="red" />
                  </Marker>
                </Map>
              </Box>
            </Grid>

            {/* Right Column - Products */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {t("availableProducts")}
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : products.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {products.map((product) => (
                    <Card key={product._id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {product.productImageURL && (
                            <Image
                              src={product.productImageURL}
                              alt={product.productName}
                              style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {product.productName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {product.productDescription}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Typography variant="h6" color="primary">
                                ${product.productPrice.toFixed(2)}
                              </Typography>
                              <Button
                                variant="contained"
                                onClick={() => handleAddToCart(product._id)}
                                disabled={addingToCart === product._id}
                                size="small"
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
                <Typography color="text.secondary">
                  {t("noProducts")}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  );
};

export default VendorFullView;