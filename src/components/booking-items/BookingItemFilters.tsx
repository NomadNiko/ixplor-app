import React from 'react';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "@/services/i18n/client";
import { BookingItemStatusEnum } from '@/hooks/booking/types';

export interface BookingItemFilters {
  search: string;
  status: BookingItemStatusEnum | '';
  sortOrder: 'asc' | 'desc';
}

interface BookingItemFiltersProps {
  filters: BookingItemFilters;
  onFilterChange: (field: keyof BookingItemFilters, value: string) => void;
}

export const BookingItemFilters: React.FC<BookingItemFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const { t } = useTranslation("booking-items");

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={t('filters.search')}
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>{t('filters.status')}</InputLabel>
          <Select
            value={filters.status}
            label={t('filters.status')}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <MenuItem value="">{t('filters.all')}</MenuItem>
            <MenuItem value={BookingItemStatusEnum.PUBLISHED}>
              {t('status.published')}
            </MenuItem>
            <MenuItem value={BookingItemStatusEnum.DRAFT}>
              {t('status.draft')}
            </MenuItem>
            <MenuItem value={BookingItemStatusEnum.ARCHIVED}>
              {t('status.archived')}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>{t('filters.sort')}</InputLabel>
          <Select
            value={filters.sortOrder}
            label={t('filters.sort')}
            onChange={(e) => onFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">{t('sort.priceAsc')}</MenuItem>
            <MenuItem value="desc">{t('sort.priceDesc')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};