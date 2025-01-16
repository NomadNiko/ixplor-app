"use client";
import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { ProductCard } from '@/components/product/product-card';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductStatusEnum } from '@/components/product/types/product';

interface Product {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    vendorId: string;
    productImageURL?: string;
    productStatus: ProductStatusEnum;
    productDuration?: number;
    productDate?: string;
    productStartTime?: string;
    productEndTime?: string;
    productAdditionalInfo?: string;
    productRequirements?: string[];
    productWaiver?: string;
    createdAt: string;
    updatedAt: string;
  }

  const defaultLocation = {
    type: 'Point' as const,
    coordinates: [-157.8241926, 21.2758128] // Default to Waikiki
  };
  

export default function ProductsPageContent() {
  const { t } = useTranslation("products");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        router.push('/sign-in');
        return;
      }
  
      const response = await fetch(`${API_URL}/products/admin/all`, {
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });
  
      if (response.ok) {
        const result = await response.json();
        const productsWithLocation = result.data.map((product: Product) => ({
          ...product,
          location: product.location || defaultLocation
        }));
        setProducts(productsWithLocation);
      } else {
        throw new Error('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      enqueueSnackbar(t('errors.failedToLoadProducts'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        return;
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (response.ok) {
        enqueueSnackbar(t('success.deleted'), { variant: 'success' });
        await loadProducts();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      enqueueSnackbar(t('errors.deleteFailed'), { variant: 'error' });
    }
  };

  const handleStatusChange = async (id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        return;
      }

      const response = await fetch(`${API_URL}/products/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        enqueueSnackbar(t(`success.status.${status.toLowerCase()}`), { variant: 'success' });
        await loadProducts();
      } else {
        throw new Error('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      enqueueSnackbar(t('errors.statusUpdateFailed'), { variant: 'error' });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)' 
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs>
          <Typography variant="h4" gutterBottom>
            {t("title")}
          </Typography>
          <Typography color="text.secondary">
            {t("subtitle")}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => router.push('/products/add')}
          >
            {t("addProduct")}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
              {t("noProducts")}
            </Typography>
          </Grid>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard
                product={product}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onUpdate={loadProducts}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}