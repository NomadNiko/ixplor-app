import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { VendorLocation } from '@/components/mock-data/vendor-location';
import { X, Phone } from 'lucide-react';

export const VendorShortView: React.FC<{
  vendor: VendorLocation;
  onViewMore: () => void;
  onClose: () => void;
}> = ({ vendor, onViewMore, onClose }) => {
  const { businessName, logoUrl, phone } = vendor.properties;

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
                  maxWidth: '150px',
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
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone size={14} /> {phone}
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
              Learn More
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorShortView;