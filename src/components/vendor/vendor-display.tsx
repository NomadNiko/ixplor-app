import React from 'react';
import { Marker, Popup } from 'react-map-gl';
import { Chip, Card, CardContent, Typography, Box } from '@mui/material';
import { VendorLocation, VendorType } from '@/components/mock-data/vendor-location';
import { 
  Binoculars, 
  GraduationCap,
  Timer,
  Ticket
} from 'lucide-react';

// Helper function to get the correct icon for vendor type
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

// VendorMarker Component
export const VendorMarker: React.FC<{
  vendor: VendorLocation;
  onClick: () => void;
}> = ({ vendor, onClick }) => {
  const { coordinates } = vendor.geometry;
  const { businessName, vendorType, logoUrl } = vendor.properties;

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

// VendorShortView Component
export const VendorShortView: React.FC<{
  vendor: VendorLocation;
  onViewMore: () => void;
  onClose: () => void;
}> = ({ vendor, onViewMore, onClose }) => {
  const { businessName, description, logoUrl } = vendor.properties;

  return (
    <Card className="absolute bottom-24 left-4 right-4 md:left-24 md:right-24 bg-background-glass backdrop-blur-md">
      <CardContent className="p-4">
        <Box className="flex items-start gap-4">
          <img 
            src={logoUrl} 
            alt={businessName}
            className="w-16 h-16 object-contain"
          />
          <Box className="flex-1">
            <Typography variant="h6" className="text-white">
              {businessName}
            </Typography>
            <Typography variant="body2" className="text-gray-300 line-clamp-2">
              {description}
            </Typography>
            <button
              onClick={onViewMore}
              className="mt-2 text-primary-light hover:text-primary-main text-sm"
            >
              View More
            </button>
          </Box>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </Box>
      </CardContent>
    </Card>
  );
};

// VendorFullView Component
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
    <Card className="absolute top-24 bottom-24 left-4 right-4 md:left-24 md:right-24 bg-background-glass backdrop-blur-md overflow-auto">
      <CardContent className="p-6">
        <Box className="flex justify-between items-start mb-6">
          <Box className="flex items-center gap-4">
            <img 
              src={logoUrl} 
              alt={businessName}
              className="w-24 h-24 object-contain"
            />
            <Box>
              <Typography variant="h4" className="text-white">
                {businessName}
              </Typography>
              <Chip
                icon={getVendorIcon(vendorType)}
                label={vendorType.charAt(0).toUpperCase() + vendorType.slice(1)}
                size="small"
                className="mt-2"
              />
            </Box>
          </Box>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </Box>

        <Box className="space-y-6">
          <Box>
            <Typography variant="h6" className="text-white mb-2">
              About
            </Typography>
            <Typography className="text-gray-300">
              {description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" className="text-white mb-2">
              Location
            </Typography>
            <Typography className="text-gray-300">
              {address}<br />
              {city}, {state} {postalCode}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" className="text-white mb-2">
              Contact
            </Typography>
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light hover:text-primary-main"
            >
              Visit Website
            </a>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};