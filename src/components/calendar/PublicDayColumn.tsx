// PublicDayColumn.tsx
import { format } from 'date-fns';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { alpha } from '@mui/material/styles';
import { ProductItem } from '@/app/[language]/types/product-item';
import { useTranslation } from "@/services/i18n/client";
import { formatDuration } from '@/components/utils/duration-utils';

interface PublicDayColumnProps {
  date: Date;
  items: ProductItem[];
  onItemClick: (item: ProductItem) => void;
  isToday: boolean;
}

export default function PublicDayColumn({
  date,
  items,
  onItemClick,
  isToday
}: PublicDayColumnProps) {
  const { t } = useTranslation("tests");

  return (
    <Box sx={{
      flex: 1,
      minWidth: 0,
      height: '100%',
      borderRight: 1,
      borderColor: 'divider',
      '&:last-child': {
        borderRight: 0,
      }
    }}>
      <Box sx={{
        p: 1,
        textAlign: 'center',
        bgcolor: (theme) =>
          isToday
            ? alpha(theme.palette.primary.main, 0.1)
            : 'transparent',
        borderBottom: 1,
        borderColor: 'divider',
      }}>
        <Typography variant="subtitle2">{format(date, 'EEE')}</Typography>
        <Typography
          variant="h6"
          color={isToday ? "primary" : "text.primary"}
        >
          {format(date, 'd')}
        </Typography>
      </Box>

      <Box sx={{
        height: 'calc(100% - 70px)',
        overflow: 'auto',
        p: 1,
      }}>
        {items.map((item) => (
          <Paper
            key={item._id}
            onClick={() => onItemClick(item)}
            sx={{
              p: 1.5,
              mb: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
                bgcolor: 'action.hover',
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                wordBreak: 'break-word',
                mb: 0.5,
              }}
            >
              {item.templateName}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              {format(new Date(`2000-01-01T${item.startTime}`), 'h:mm a')}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              {formatDuration(item.duration)}
            </Typography>

            <Typography
              variant="caption"
              color="primary"
              sx={{ 
                display: 'block',
                mt: 0.5,
                fontWeight: 'bold'
              }}
            >
              ${item.price.toFixed(2)}
            </Typography>
          </Paper>
        ))}

        {items.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 2 }}
          >
            {t('noAvailableItems')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}