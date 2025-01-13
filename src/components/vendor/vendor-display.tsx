import React from 'react';
import { Marker } from 'react-map-gl';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { VendorLocation, VendorType } from '@/components/mock-data/vendor-location';
import { 
  Binoculars, 
  GraduationCap,
  Timer,
  Ticket,
  X
} from 'lucide-react';

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

export const VendorMarker: React.FC<{
  vendor: VendorLocation;
  onClick: () => void;
}> = ({ vendor, onClick }) => {
  const { coordinates } = vendor.geometry;
  const { businessName, vendorType } = vendor.properties;
  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor="bottom"
    >
      <Chip
        icon={getVendorIcon(vendorType)}
        label={businessName}
        onClick={onClick}
        className="bg-background-glass backdrop-blur-md hover:bg-background-glassHover cursor-pointer"
        size="small"
      />
    </Marker>
  );
};

export const VendorShortView: React.FC<{
  vendor: VendorLocation;
  onViewMore: () => void;
  onClose: () => void;
}> = ({ vendor, onViewMore, onClose }) => {
  const { businessName, description, logoUrl } = vendor.properties;
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
      <Card sx={{ position: 'relative' }}>
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
            gap: 2
          }}>
            <Box sx={{ 
              width: 64, 
              height: 64, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img 
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
            
            <Box sx={{ 
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Typography variant="h6">
                {businessName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2 
          }}>
            <Button 
              variant="contained"
              onClick={onViewMore}
              size="small"
            >
              View More
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
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
    logoUrl 
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
      <Card sx={{ position: 'relative' }}>
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
              <img 
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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
        </CardContent>
      </Card>
    </Box>
  );
};