import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { Mail, Phone, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { StaffUser, StaffUserStatusEnum } from './types/staff-user';
import QualifiedItemsModal from './QualifiedItemsModal';

interface StaffUserCardProps {
  staffUser: StaffUser;
  onClick: () => void;
  onUpdate: () => void;
}

export const StaffUserCard = ({ staffUser, onClick, onUpdate }: StaffUserCardProps) => {
  const { t } = useTranslation("staff-users");
  const router = useRouter();
  const [showQualifiedItems, setShowQualifiedItems] = useState(false);

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

  const handleGenerateShifts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/staff-shifts/${staffUser._id}/generate`);
  };

  const handleQualifiedItems = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowQualifiedItems(true);
  };

  return (
    <>
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
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<Calendar size={16} />}
                onClick={handleGenerateShifts}
              >
                {t('generateShifts')}
              </Button>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<GraduationCap size={16} />}
                onClick={handleQualifiedItems}
              >
                {t('qualifiedItems')}
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" display="block">
              {t('updated')} {formatDistance(new Date(staffUser.updatedAt), new Date(), { addSuffix: true })}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <QualifiedItemsModal
        open={showQualifiedItems}
        onClose={() => setShowQualifiedItems(false)}
        staffId={staffUser._id}
        vendorId={staffUser.vendorId}
        qualifiedProducts={staffUser.qualifiedProducts}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default StaffUserCard;