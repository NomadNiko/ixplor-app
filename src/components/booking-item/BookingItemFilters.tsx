import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "@/services/i18n/client";
import { FilterOptions } from './types/booking-item';

interface BookingItemFiltersProps {
  filters: FilterOptions;
  onFilterChange: (field: keyof FilterOptions, value: string) => void;
}

export const BookingItemFilters = ({ filters, onFilterChange }: BookingItemFiltersProps) => {
  const { t } = useTranslation("booking-items");

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={t('search')}
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>{t('filterStatus')}</InputLabel>
          <Select
            value={filters.filterStatus}
            label={t('filterStatus')}
            onChange={(e) => onFilterChange('filterStatus', e.target.value)}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="PUBLISHED">{t('status.published')}</MenuItem>
            <MenuItem value="DRAFT">{t('status.draft')}</MenuItem>
            <MenuItem value="ARCHIVED">{t('status.archived')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>{t('sort')}</InputLabel>
          <Select
            value={filters.sortOrder}
            label={t('sort')}
            onChange={(e) => onFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">{t('sortOptions.priceAsc')}</MenuItem>
            <MenuItem value="desc">{t('sortOptions.priceDesc')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};