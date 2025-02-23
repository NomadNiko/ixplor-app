"use client";
import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from '@/services/auth/use-auth';
import { useCalendarNavigation } from '@/hooks/use-calendar-navigation';
import StaffWeeklyCalendar from '@/components/staff-shifts/calendar/StaffWeeklyCalendar';
import ShiftDetailModal from '@/components/staff-shifts/calendar/ShiftDetailModal';
import { StaffShift } from '@/hooks/use-staff-shifts';

interface StaffUser {
  _id: string;
  name: string;
  shifts: Array<{
    _id: string;
    startDateTime: string;
    endDateTime: string;
  }>;
}

export default function StaffShiftsPageContent() {
  const { user } = useAuth();
  const { t } = useTranslation("staff-shifts");
  const [shifts, setShifts] = useState<StaffShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState<StaffShift | null>(null);
  const { currentWeek, nextWeek, previousWeek, goToToday } = useCalendarNavigation();

  useEffect(() => {
    const loadShifts = async () => {
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          return;
        }

        const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${user?.id}/owned`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!vendorResponse.ok) {
          throw new Error('Failed to fetch vendor information');
        }

        const vendorData = await vendorResponse.json();
        if (!vendorData.data.length) {
          setShifts([]);
          return;
        }

        // Get all staff users for the vendor
        const staffResponse = await fetch(`${API_URL}/staff-users/vendor/${vendorData.data[0]._id}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!staffResponse.ok) {
          throw new Error('Failed to load staff users');
        }

        const staffData = await staffResponse.json();
        
        // Collect all shifts from all staff users
        const allShifts = staffData.data.reduce((acc: StaffShift[], staffUser: StaffUser) => {
          return acc.concat(staffUser.shifts.map(shift => ({
            ...shift,
            staffId: staffUser._id,
            staffName: staffUser.name
          })));
        }, []);

        setShifts(allShifts);
      } catch (error) {
        console.error('Error loading shifts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShifts();
  }, [user?.id]);

  if (loading) {
    return (
      <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 4,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 } }}>
          {t("title")}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2 
        }}>
          <IconButton onClick={previousWeek} size="small">
            <ChevronLeft />
          </IconButton>
          
          <Button
            variant="outlined"
            startIcon={<Calendar />}
            onClick={goToToday}
          >
            {t("today")}
          </Button>
          
          <IconButton onClick={nextWeek} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <StaffWeeklyCalendar
        shifts={shifts}
        currentWeek={currentWeek}
        onShiftClick={setSelectedShift}
      />

      <ShiftDetailModal
        shift={selectedShift}
                staffId={String(user?.id) || ''} 
        open={!!selectedShift}
        onClose={() => setSelectedShift(null)}
        onUpdate={() => {
          setSelectedShift(null);
          // Refresh shifts
        }}
      />
    </Container>
  );
}