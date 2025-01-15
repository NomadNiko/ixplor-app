import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

interface VendorEditContactProps {
  email: string;
  phone: string;
  website: string;
  logoUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
}

export const VendorEditContact: React.FC<VendorEditContactProps> = ({
  email,
  phone,
  website,
  logoUrl,
  onChange,
  t
}) => (
  <Box sx={{ display: 'grid', gap: 2 }}>
    <Typography variant="h6">{t('contact')}</Typography>
    <TextField
      fullWidth
      label={t('email')}
      name="email"
      value={email}
      onChange={onChange}
    />
    <TextField
      fullWidth
      label={t('phone')}
      name="phone"
      value={phone}
      onChange={onChange}
    />
    <TextField
      fullWidth
      label={t('website')}
      name="website"
      value={website}
      onChange={onChange}
    />
    <TextField
      fullWidth
      label={t('logoUrl')}
      name="logoUrl"
      value={logoUrl}
      onChange={onChange}
    />
  </Box>
);