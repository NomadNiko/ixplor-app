import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { VendorLocation, VendorType } from '@/components/mock-data/vendor-location';
import { X, Binoculars, GraduationCap, Timer, Ticket } from 'lucide-react';

const getVendorIcon = (type: VendorType) => {
  switch (type) {
    case 'tours':
      return <Binoculars size={20} />;
    case 'lessons':
      return <GraduationCap size={20} />;
    case 'rentals':
      return <Timer size={20} />;
    case 'tickets':
      return <Ticket size={20} />;
  }
};

export const VendorListView: React.FC<{
  vendors: VendorLocation[];
  onVendorClick: (vendor: VendorLocation) => void;
  onClose: () => void;
  position: { longitude: number; latitude: number };
}> = ({ vendors, onVendorClick, onClose, position }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: position.longitude,
        top: position.latitude,
        transform: 'translate(-50%, -100%)',
        marginTop: -1, // Small offset to avoid overlap with markers
        width: 280, // Roughly the width of 4 markers
        zIndex: 2,
      }}
    >
      <Card>
        <CardContent sx={{ position: 'relative', p: 2 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary'
              }
            }}
          >
            <X size={20} />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Nearby Vendors ({vendors.length})
          </Typography>

          <List
            sx={{
              maxHeight: 280,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {vendors.map((vendor) => (
              <ListItemButton 
                key={vendor.properties.businessName}
                onClick={() => onVendorClick(vendor)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'background.glass',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getVendorIcon(vendor.properties.vendorType)}
                </ListItemIcon>
                <ListItemText 
                  primary={vendor.properties.businessName}
                  secondary={vendor.properties.vendorType.charAt(0).toUpperCase() + vendor.properties.vendorType.slice(1)}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption'
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorListView;