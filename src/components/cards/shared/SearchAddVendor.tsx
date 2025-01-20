import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Store } from 'lucide-react';
import { useTranslation } from '@/services/i18n/client';
import { useGetAllVendorsService } from '@/services/api/services/vendors';
import { Vendor } from '@/app/[language]/types/vendor';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { useSnackbar } from '@/hooks/use-snackbar';

interface SearchAddVendorProps {
  disabled?: boolean;
  required?: boolean;
}

export default function SearchAddVendor({ disabled = false, required = false }: SearchAddVendorProps) {
  const { t } = useTranslation('tests');
  const { enqueueSnackbar } = useSnackbar();
  const { setValue } = useFormContext();
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  const getAllVendors = useGetAllVendorsService();

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const response = await getAllVendors();
        if (response.status === HTTP_CODES_ENUM.OK && response.data) {
          const approvedVendors = response.data.data.filter(
            vendor => vendor.vendorStatus === 'APPROVED'
          );
          setVendors(approvedVendors);
        }
      } catch (error) {
        console.error('Error loading vendors:', error);
        enqueueSnackbar(t('errors.failedToLoadVendors'), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, [getAllVendors, enqueueSnackbar, t]);

  const handleVendorChange = (_: React.SyntheticEvent<Element, Event>, vendor: Vendor | null) => {
    setSelectedVendor(vendor);
    if (vendor) {
      setValue('vendorId', vendor._id);
      setValue('location', vendor.location);
      setValue('city', vendor.city);
      setValue('state', vendor.state);
    } else {
      setValue('vendorId', '');
      setValue('location', null);
      setValue('city', '');
      setValue('state', '');
    }
  };

  return (
    <Autocomplete
      options={vendors}
      loading={loading}
      value={selectedVendor}
      onChange={handleVendorChange}
      getOptionLabel={(vendor) => vendor.businessName}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('fields.vendor')}
          required={required}
          helperText={t('vendorHelp')}
        />
      )}
      renderOption={(props, vendor) => (
        <li {...props}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            width: '100%',
            px: 2,
            py: 1
          }}>
            <Box sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {vendor.logoUrl ? (
                <img
                  loading="lazy"
                  width="40"
                  height="40"
                  src={vendor.logoUrl}
                  alt={vendor.businessName}
                  style={{ 
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
              ) : (
                <Store size={40} />
              )}
            </Box>
            <Box sx={{ 
              flexGrow: 1,
              minWidth: 0 
            }}>
              <Typography variant="subtitle1" noWrap>
                {vendor.businessName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {vendor.city}, {vendor.state}
              </Typography>
            </Box>
          </Box>
        </li>
      )}
      PaperComponent={({ children, ...other }) => (
        <Paper
          {...other}
          elevation={8}
          sx={{
            backgroundColor: 'background.glass',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          {children}
        </Paper>
      )}
      sx={{
        '& .MuiAutocomplete-listbox': {
          maxHeight: '300px'
        }
      }}
    />
  );
}