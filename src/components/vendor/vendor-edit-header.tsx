import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import { Image } from "@nextui-org/react";

interface VendorEditHeaderProps {
  logoUrl: string;
  businessName: string;
  description: string;
  vendorType: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
}

export const VendorEditHeader: React.FC<VendorEditHeaderProps> = ({
  logoUrl,
  businessName,
  description,
  vendorType,
  onChange,
  t
}) => (
  <Box sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: 3,
    mb: 2,
  }}>
    <Box sx={{
      width: { xs: "100%", sm: 100 },
      height: { xs: 100, sm: 100 },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <Image
        src={logoUrl}
        alt={businessName}
        style={{
          maxWidth: "100px",
          maxHeight: "100px",
          objectFit: "contain",
        }}
      />
    </Box>

    <Box sx={{ flex: 1 }}>
      <Typography variant="h5" gutterBottom>
        {t('editVendor')}
      </Typography>

      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField
          fullWidth
          label={t('businessName')}
          name="businessName"
          value={businessName}
          onChange={onChange}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label={t('description')}
          name="description"
          value={description}
          onChange={onChange}
        />

        <TextField
          select
          fullWidth
          label={t('vendorType')}
          name="vendorType"
          value={vendorType}
          onChange={onChange}
        >
          {['tours', 'lessons', 'rentals', 'tickets'].map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  </Box>
);