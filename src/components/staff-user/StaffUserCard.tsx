import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Mail, Phone, Calendar, BookOpen } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { StaffUser, StaffUserStatusEnum } from './types/staff-user';

interface StaffUserCardProps {
  staffUser: StaffUser;
  onClick: () => void;
}

export const StaffUserCard = ({ staffUser, onClick }: StaffUserCardProps) => {
  const { t } = useTranslation("staff-users");

  const getStatusColor = (status: StaffUserStatusEnum): "success" | "error" | "default" => {
    switch (status) {
      case StaffUserStatusEnum.ACTIVE:
        return 'success';
      case StaffUserStatusEnum.INACTIVE:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out'
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {staffUser.name}
          </Typography>
          <Chip
            label={t(`status.${staffUser.status.toLowerCase()}`)}
            color={getStatusColor(staffUser.status)}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {staffUser.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Mail size={16} />
              <Typography variant="body2">
                {staffUser.email}
              </Typography>
            </Box>
          )}
          {staffUser.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone size={16} />
              <Typography variant="body2">
                {staffUser.phone}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={16} />
            <Typography variant="body2">
              {staffUser.shifts.length} {t('shifts')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BookOpen size={16} />
            <Typography variant="body2">
              {staffUser.qualifiedProducts.length} {t('qualifications')}
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          {t('updated')} {formatDistance(new Date(staffUser.updatedAt), new Date(), { addSuffix: true })}
        </Typography>
      </CardContent>
    </Card>
  );
};