import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from '@/services/i18n/client';
import { useAddToCartService } from '@/services/api/services/cart';
import { useGetAllProductsService } from '@/services/api/services/products';
import { useEffect } from 'react';
import { useSnackbar } from '@/hooks/use-snackbar';
import { Product } from '@/app/[language]/types/product';
import { ProductStatusEnum } from '@/app/[language]/types/product';
import { ShoppingCart } from 'lucide-react';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';

export default function ProductQuickAdd() {
  const { t } = useTranslation('cart');
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const getAllProducts = useGetAllProductsService();
  const addToCart = useAddToCartService();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response.status === HTTP_CODES_ENUM.OK && response.data) {
          const publishedProducts = response.data.data.filter(
            (product) => product.productStatus === ProductStatusEnum.PUBLISHED
          );
          setProducts(publishedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        enqueueSnackbar(t('errors.failedToLoadProducts'), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCart(product._id);
      await addToCart({
        productId: product._id,
        quantity: 1,
      });
      enqueueSnackbar(t('success.addedToCart'), { variant: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      enqueueSnackbar(t('errors.failedToAddToCart'), { variant: 'error' });
    } finally {
      setAddingToCart(null);
    }
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('quickAdd.title')}
        </Typography>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ${product.productPrice.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product._id}
                    startIcon={
                      addingToCart === product._id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <ShoppingCart size={20} />
                      )
                    }
                  >
                    {addingToCart === product._id
                      ? t('quickAdd.adding')
                      : t('quickAdd.addToCart')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}