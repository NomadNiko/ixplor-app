import { format } from 'date-fns';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
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
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              mb: 0.5
            }}>
              <Typography
                variant="subtitle2"
                sx={{
                  wordBreak: 'break-word',
                  flex: 1,
                  pr: 1
                }}
              >
                {item.templateName}
              </Typography>
              {item.quantityAvailable === 0 && (
                <Chip
                  label={t('soldOut')}
                  color="error"
                  size="small"
                  sx={{ 
                    height: 20,
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.625rem'
                    }
                  }}
                />
              )}
            </Box>

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

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 0.5 
            }}>
              <Typography
                variant="caption"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                ${item.price.toFixed(2)}
              </Typography>
              {item.quantityAvailable > 0 && item.quantityAvailable <= 3 && (
                <Typography
                  variant="caption"
                  color="warning.main"
                  sx={{ fontWeight: 'medium' }}
                >
                  {t('onlyXLeft', { count: item.quantityAvailable })}
                </Typography>
              )}
            </Box>
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