import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
//import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { Phone, Mail, X, Globe } from "lucide-react";
import { Image } from "@nextui-org/react";
import { useTranslation } from "@/services/i18n/client";
import { Vendor } from "@/app/[language]/types/vendor";

interface VendorFullViewProps {
  vendor: Vendor;
  onClose: () => void;
}

export const VendorFullView = ({ vendor, onClose }: VendorFullViewProps) => {
  const { t } = useTranslation("vendor");

  return (
    <Box sx={{
      width: "100%",
      position: "fixed",
      bottom: { xs: 0, md: 10 },
      left: 0,
      right: 0,
      padding: theme => theme.spacing(2),
      backgroundColor: theme => theme.palette.background.glass,
      backdropFilter: "blur(10px)",
      borderRadius: { xs: 0, md: 2 },
      zIndex: 1000,
    }}>
      <Card>
        <CardContent sx={{ position: 'relative' }}>
          <IconButton 
            onClick={onClose}
            sx={{ 
              position: 'absolute',
              top: 8,
              left: 8,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary'
              }
            }}
          >
            <X size={20} />
          </IconButton>
          
          <Box sx={{ pt: 6 }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 2,
              mb: 4
            }}>
              <Box sx={{ 
                width: 96,
                height: 96,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Image 
                  src={vendor.logoUrl} 
                  alt={vendor.businessName}
                  style={{ 
                    maxWidth: '200px',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {vendor.businessName}
                </Typography>
                <Chip
                  label={t(`vendorTypes.${vendor.vendorType}`)}
                  size="small"
                  color="primary"
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t("about")}
                </Typography>
                <Typography color="text.secondary">
                  {vendor.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  {t("location")}
                </Typography>
                <Typography color="text.secondary">
                  {vendor.address}<br />
                  {vendor.city}, {vendor.state} {vendor.postalCode}
                </Typography>
              </Box>

              <Box>
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorFullView;