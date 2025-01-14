import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { VendorLocation, VendorType } from '@/components/mock-data/vendor-location';
import { 
  Binoculars, 
  GraduationCap,
  Timer,
  Ticket,
  X,
  Phone,
  Mail
} from 'lucide-react';
import { Image } from "@nextui-org/react";

const getVendorIcon = (type: VendorType) => {
  switch (type) {
    case 'tours':
      return <Binoculars size={14} />;
    case 'lessons':
      return <GraduationCap size={14} />;
    case 'rentals':
      return <Timer size={14} />;
    case 'tickets':
      return <Ticket size={14} />;
  }
};

export const VendorFullView: React.FC<{
  vendor: VendorLocation;
  onClose: () => void;
}> = ({ vendor, onClose }) => {
  const { 
    businessName, 
    description, 
    vendorType,
    website,
    address,
    city,
    state,
    postalCode,
    logoUrl,
    phone,
    email
  } = vendor.properties;
  
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
      <Card 
        sx={{ 
          position: 'relative', 
          maxHeight: { 
            xs: 'calc(100vh - 120px)', 
            md: 'none'
          },
          overflowY: 'auto'
        }}
      >
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

        <CardContent sx={{ pt: 6 }}>
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
                src={logoUrl} 
                alt={businessName}
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
                {businessName}
              </Typography>
              <Chip
                icon={getVendorIcon(vendorType)}
                label={vendorType.charAt(0).toUpperCase() + vendorType.slice(1)}
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 , fontSize: "0.60rem"}}>
            <Box>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography color="text.secondary">
                {description}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Typography color="text.secondary">
                {address}<br />
                {city}, {state} {postalCode}
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
                  <Link href={`tel:${phone}`} color="inherit">
                    {phone}
                  </Link>
                </Typography>
                <Typography 
                  color="text.secondary" 
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Mail size={16} /> 
                  <Link href={`mailto:${email}`} color="inherit">
                    {email}
                  </Link>
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorFullView;