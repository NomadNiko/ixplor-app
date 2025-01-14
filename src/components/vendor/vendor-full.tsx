// src/components/vendor/vendor-full.tsx
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { Vendor } from '@/app/[language]/types/vendor';
import { X, Phone, Mail } from 'lucide-react';
import { Image } from "@nextui-org/react";

interface VendorFullViewProps {
  vendor: Vendor;
  onClose: () => void;
}

export const VendorFullView: React.FC<VendorFullViewProps> = ({ vendor, onClose }) => {
  return (
    <Box sx={{
      width: "100%",
      position: "fixed",
      bottom: { xs: 0, md: 10 },
      left: 0,
      right: 0,
      padding: (theme) => theme.spacing(2),
      backgroundColor: (theme) => theme.palette.background.glass,
      backdropFilter: "blur(10px)",
      borderRadius: { xs: 0, md: 2 },
      zIndex: 1,
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
              gap: 3,
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
                  label={vendor.vendorType.charAt(0).toUpperCase() + vendor.vendorType.slice(1)}
                  size="small"
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  About
                </Typography>
                <Typography color="text.secondary">
                  {vendor.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Location
                </Typography>
                <Typography color="text.secondary">
                  {vendor.address}<br />
                  {vendor.city}, {vendor.state} {vendor.postalCode}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Contact
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
                    <Button
                      variant="outlined"
                      color="primary"
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </Button>
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