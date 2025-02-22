import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "@/services/i18n/client";
import { FilterOptions } from './types/staff-user';

interface StaffUserFiltersProps {
  filters: FilterOptions;
  onFilterChange: (field: keyof FilterOptions, value: string) => void;
}

export const StaffUserFilters = ({ filters, onFilterChange }: StaffUserFiltersProps) => {
  const { t } = useTranslation("staff-users");

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          label={t('search')}
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          placeholder={t('searchPlaceholder')}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>{t('filterStatus')}</InputLabel>
          <Select
            value={filters.filterStatus}
            label={t('filterStatus')}
            onChange={(e) => onFilterChange('filterStatus', e.target.value)}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="ACTIVE">{t('status.active')}</MenuItem>
            <MenuItem value="INACTIVE">{t('status.inactive')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>{t('sort')}</InputLabel>
          <Select
            value={filters.sortOrder}
            label={t('sort')}
            onChange={(e) => onFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">{t('sortOptions.nameAsc')}</MenuItem>
            <MenuItem value="desc">{t('sortOptions.nameDesc')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};