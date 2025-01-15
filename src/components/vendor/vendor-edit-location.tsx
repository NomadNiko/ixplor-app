import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

interface VendorEditLocationProps {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
}

export const VendorEditLocation: React.FC<VendorEditLocationProps> = ({
  address,
  city,
  state,
  postalCode,
  onChange,
  t
}) => (
  <Box sx={{ display: 'grid', gap: 2 }}>
    <Typography variant="h6">{t('location')}</Typography>
    <TextField
      fullWidth
      label={t('address')}
      name="address"
      value={address}
      onChange={onChange}
    />
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
      <TextField
        fullWidth
        label={t('city')}
        name="city"
        value={city}
        onChange={onChange}
      />
      <TextField
        fullWidth
        label={t('state')}
        name="state"
        value={state}
        onChange={onChange}
      />
      <TextField
        fullWidth
        label={t('postalCode')}
        name="postalCode"
        value={postalCode}
        onChange={onChange}
      />
    </Box>
  </Box>
);