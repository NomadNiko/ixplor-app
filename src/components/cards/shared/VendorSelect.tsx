import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from '@/services/i18n/client';
import { useSnackbar } from '@/hooks/use-snackbar';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import useAuth from '@/services/auth/use-auth';
import { Vendor } from '@/app/[language]/types/vendor';

interface VendorSelectProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export const VendorSelect: React.FC<VendorSelectProps> = ({
  name,
  label,
  required = false,
  disabled = false
}) => {
  const { t } = useTranslation('products');
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { register, setValue } = useFormContext();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserVendors = async () => {
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
          return;
        }

        // Fetch vendors where user is an owner
        const response = await fetch(`${API_URL}/vendors/user/${user?.id}/owned`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }

        const data = await response.json();
        setVendors(data.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        enqueueSnackbar(t('errors.failedToLoadVendors'), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserVendors();
    }
  }, [user?.id, enqueueSnackbar, t]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value);
  };

  return (
    <TextField
      {...register(name)}
      select
      fullWidth
      label={label}
      required={required}
      disabled={disabled || loading}
      onChange={handleChange}
      InputProps={{
        startAdornment: loading ? (
          <CircularProgress size={20} sx={{ mr: 1 }} />
        ) : null,
      }}
    >
      {vendors.map((vendor) => (
        <MenuItem key={vendor._id} value={vendor._id}>
          {vendor.businessName}
        </MenuItem>
      ))}
    </TextField>
  );
};
