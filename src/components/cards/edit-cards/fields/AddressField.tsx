import { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from '@/services/i18n/client';
import { FieldConfig, FormData } from '../types';
import { useGooglePlaces } from '@/hooks/use-google-places';

interface AddressFieldProps {
  field: FieldConfig;
}

export const AddressField: React.FC<AddressFieldProps> = () => {
  const { register, setValue } = useFormContext<FormData>();
  const { errors } = useFormState();
  const { t } = useTranslation('tests');
  const { getPlacePredictions, getPlaceDetails } = useGooglePlaces();
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue('address', input);
    
    if (input.length > 3) {
      const newPredictions = await getPlacePredictions(input);
      setPredictions(newPredictions);
    } else {
      setPredictions([]);
    }
  };

  const handleAddressSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    const details = await getPlaceDetails(prediction.place_id);
    if (details) {
      setValue('address', details.address);
      setValue('city', details.city);
      setValue('state', details.state);
      setValue('postalCode', details.postalCode);
      setPredictions([]);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          {...register('address')}
          fullWidth
          label={t('address')}
          onChange={handleAddressChange}
          error={!!errors.address}
          helperText={errors.address?.message as string}
        />
        {predictions.length > 0 && (
          <div className="absolute z-10 w-full bg-white shadow-lg rounded-b border">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddressSelect(prediction)}
              >
                {prediction.description}
              </div>
            ))}
          </div>
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          {...register('city')}
          fullWidth
          label={t('city')}
          error={!!errors.city}
          helperText={errors.city?.message as string}
          InputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          {...register('state')}
          fullWidth
          label={t('state')}
          error={!!errors.state}
          helperText={errors.state?.message as string}
          InputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          {...register('postalCode')}
          fullWidth
          label={t('postalCode')}
          error={!!errors.postalCode}
          helperText={errors.postalCode?.message as string}
          InputProps={{ readOnly: true }}
        />
      </Grid>
    </Grid>
  );
};