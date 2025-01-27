import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { ProductCard } from "@/components/product/product-card";
import { Plus, Filter, ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, ProductStatusEnum } from "@/app/[language]/types/product";
import ProductFilters, {
  ProductFilters as FilterType,
} from "@/components/product/product-filters";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";

const defaultLocation = {
  type: "Point" as const,
  coordinates: [-157.8241926, 21.2758128], // Default to Waikiki
};

export default function ProductsPageContent() {
  const { t } = useTranslation("products");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterType>({
    types: [],
    statuses: [],
    cities: [],
    priceRange: [0, 1000],
    search: "",
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();

      if (!tokensInfo?.token) {
        enqueueSnackbar(t("errors.unauthorized"), { variant: "error" });
        router.push("/sign-in");
        return;
      }

      const response = await fetch(`${API_URL}/products/admin/all`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const productsWithLocation = result.data.map((product: Product) => ({
          ...product,
          location: product.location || defaultLocation,
        }));
        setProducts(productsWithLocation);

        // Extract unique cities
        const cityStrings = productsWithLocation.map(
          (product: Product) =>
            `${product.city || "Honolulu"}, ${product.state || "HI"}`
        );
        const uniqueCitiesSet = new Set<string>(cityStrings);
        const uniqueCities: string[] = Array.from(uniqueCitiesSet);
        setCities(uniqueCities);

        // Initialize filtered products
        setFilteredProducts(productsWithLocation);
      } else {
        throw new Error("Failed to load products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      enqueueSnackbar(t("errors.failedToLoadProducts"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);

    let filtered = [...products];

    // Apply search filter
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchLower) ||
          product.productDescription.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (newFilters.types.length > 0) {
      filtered = filtered.filter((product) =>
        newFilters.types.includes(product.productType)
      );
    }

    // Apply status filter
    if (newFilters.statuses.length > 0) {
      filtered = filtered.filter((product) =>
        newFilters.statuses.includes(product.productStatus)
      );
    }

    // Apply city filter
    if (newFilters.cities.length > 0) {
      filtered = filtered.filter((product) =>
        newFilters.cities.includes(
          `${product.city || "Unknown City"}, ${product.state || "HI"}`
        )
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        product.productPrice >= newFilters.priceRange[0] &&
        product.productPrice <= newFilters.priceRange[1]
    );

    setFilteredProducts(filtered);
  };

  const handleStatusChange = async (id: string, status: ProductStatusEnum) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t("errors.unauthorized"), { variant: "error" });
        return;
      }

      const response = await fetch(`${API_URL}/products/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        enqueueSnackbar(t(`success.status.${status.toLowerCase()}`), {
          variant: "success",
        });
        await loadProducts();
      } else {
        throw new Error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      enqueueSnackbar(t("errors.statusUpdateFailed"), { variant: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t("errors.unauthorized"), { variant: "error" });
        return;
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (response.ok) {
        enqueueSnackbar(t("success.deleted"), { variant: "success" });
        await loadProducts();
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      enqueueSnackbar(t("errors.deleteFailed"), { variant: "error" });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    handleFilterChange(filters);
  }, [products, filters]);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            {t("title")}
          </Typography>
          <Typography color="text.secondary">{t("subtitle")}</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={showFilters ? <ChevronUp /> : <ChevronDown />}
          >
            <Filter className="mr-2" size={16} />
            {t("filters.title")}
          </Button>

          <Button
            variant="contained"
            onClick={() => router.push("/products/add")}
            startIcon={<Plus size={16} />}
          >
            {t("addProduct")}
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Collapse in={showFilters}>
        <ProductFilters onFilterChange={handleFilterChange} cities={cities} />
      </Collapse>

      {/* Results Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography color="text.secondary">
          {t("showing")} {filteredProducts.length} {t("of")} {products.length}{" "}
          {t("products")}
        </Typography>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                background: "rgba(17, 25, 40, 0.75)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.125)",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {t("noProductsFound")}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t("tryAdjustingFilters")}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredProducts.map((product) => (
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
