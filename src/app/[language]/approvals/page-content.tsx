import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { useTranslation } from "@/services/i18n/client";
import { useGetAllVendorsService } from "@/services/api/services/vendors";
import { useGetAllProductsService } from "@/services/api/services/products";
import { useEffect, useState } from 'react';
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";
import { Product, ProductStatusEnum } from "@/app/[language]/types/product";
import { useSnackbar } from "@/hooks/use-snackbar";
import { VendorApprovalCard } from "@/components/vendor/vendor-approval-card";
import { ProductApprovalCard } from "@/components/product/product-approval-card";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`approvals-tabpanel-${index}`}
      aria-labelledby={`approvals-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ApprovalsPage() {
  const { t } = useTranslation("approvals");
  const { enqueueSnackbar } = useSnackbar();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  const getAllVendors = useGetAllVendorsService();
  const getAllProducts = useGetAllProductsService();

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load vendors
      const vendorResponse = await getAllVendors();
      if (vendorResponse.status === HTTP_CODES_ENUM.OK && vendorResponse.data) {
        const submittedVendors = vendorResponse.data.data.filter(
          (v) => v.vendorStatus === VendorStatusEnum.SUBMITTED
        );
        setVendors(submittedVendors);
      }

      // Load products
      const productResponse = await getAllProducts();
      if (productResponse.status === HTTP_CODES_ENUM.OK && productResponse.data) {
        const draftProducts = productResponse.data.data.filter(
          (p) => p.productStatus === ProductStatusEnum.DRAFT
        );
        setProducts(draftProducts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      enqueueSnackbar(t('errors.failedToLoad'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (id: string, action: VendorStatusEnum, notes: string) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
      return;
    }
  
    try {
      if (action === VendorStatusEnum.APPROVED) {
        // For approval, we need to get the vendor first to get the owner ID
        const vendorResponse = await fetch(`${API_URL}/vendors/${id}`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });
        
        if (!vendorResponse.ok) {
          throw new Error('Failed to fetch vendor details');
        }
        
        const vendorData = await vendorResponse.json();
        const ownerId = vendorData.data.ownerIds[0]; // Assuming we're approving for the first owner
        
        // Use the new approval endpoint
        const response = await fetch(`${API_URL}/vendors/admin/approve/${id}/${ownerId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to approve vendor');
        }
      } else {
        // For other status updates, use the existing update endpoint
        const updateData = {
          vendorStatus: action,
          ...(action === VendorStatusEnum.ACTION_NEEDED ? { actionNeeded: notes } : {}),
          ...(notes ? { adminNotes: notes } : {})
        };
  
        const response = await fetch(`${API_URL}/vendors/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokensInfo.token}`
          },
          body: JSON.stringify(updateData)
        });
  
        if (!response.ok) {
          throw new Error('Failed to update vendor');
        }
      }
  
      enqueueSnackbar(t(`success.${action.toLowerCase()}`), { variant: 'success' });
      await loadData();
    } catch (error) {
      console.error('Error updating vendor:', error);
      enqueueSnackbar(t('errors.updateFailed'), { variant: 'error' });
    }
  };

  const handleProductAction = async (id: string, status: ProductStatusEnum, notes: string) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ 
          status,
          notes 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product status');
      }

      enqueueSnackbar(t(`success.${status.toLowerCase()}`), { variant: 'success' });
      await loadData();
    } catch (error) {
      console.error('Error updating product:', error);
      enqueueSnackbar(t('errors.updateFailed'), { variant: 'error' });
    }
  };

  const handleDelete = async (type: 'vendor' | 'product', id: string) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
      return;
    }

    try {
      const endpoint = type === 'vendor' ? 'vendors' : 'products';
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (response.ok) {
        enqueueSnackbar(t('success.deleted'), { variant: 'success' });
        await loadData();
      } else {
        throw new Error(`Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      enqueueSnackbar(t('errors.deleteFailed'), { variant: 'error' });
    }
  };

  useEffect(() => {
    loadData();
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
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      
      <Typography color="text.secondary" paragraph>
        {t("subtitle")}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="approval sections"
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t("tabs.vendors")}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    minWidth: 24,
                    textAlign: 'center'
                  }}
                >
                  {vendors.length}
                </Typography>
              </Box>
            }
            id="approvals-tab-0"
            aria-controls="approvals-tabpanel-0"
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t("tabs.products")}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    minWidth: 24,
                    textAlign: 'center'
                  }}
                >
                  {products.length}
                </Typography>
              </Box>
            }
            id="approvals-tab-1"
            aria-controls="approvals-tabpanel-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {vendors.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
                {t("noVendors")}
              </Typography>
            </Grid>
          ) : (
            vendors.map((vendor) => (
              <Grid item xs={12} key={vendor._id}>
                <VendorApprovalCard
                  vendor={vendor}
                  onAction={handleVendorAction}
                  onDelete={(id) => handleDelete('vendor', id)}
                />
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          {products.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
                {t("noProducts")}
              </Typography>
            </Grid>
          ) : (
            products.map((product) => (
              <Grid item xs={12} key={product._id}>
                <ProductApprovalCard
                  product={product}
                  onAction={handleProductAction}
                  onDelete={(id) => handleDelete('product', id)}
                />
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
    </Container>
  );
}