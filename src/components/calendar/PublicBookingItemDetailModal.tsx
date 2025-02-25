import React, { useState, useEffect, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Clock, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { BookingItem } from '@/components/booking-item/types/booking-item';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

interface ExtendedBookingItem extends BookingItem {
  vendorBusinessName?: string;
  productDate?: string;
}

interface PublicBookingItemDetailModalProps {
  item: ExtendedBookingItem;
  open: boolean;
  onClose: () => void;
  onAddToCart: (item: BookingItem, date: Date) => Promise<void>;
}

const PublicBookingItemDetailModal = ({ 
  item, 
  open, 
  onClose, 
  onAddToCart 
}: PublicBookingItemDetailModalProps) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const dateOptions = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = addDays(new Date(), i);
      return {
        value: date,
        label: format(date, 'EEEE, MMM d, yyyy')
      };
    });
  }, []);
  
  const fetchAvailableTimeSlots = async (date: Date) => {
    setLoadingAvailability(true);
    setError(null);
    
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const tokensInfo = getTokensInfo();
      
      const url = `${API_URL}/booking-availability/${item._id}/date/${formattedDate}`;
      
      const headers: HeadersInit = {};
      if (tokensInfo?.token) {
        headers['Authorization'] = `Bearer ${tokensInfo.token}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }
      
      const data = await response.json();
      
      // Convert UTC timestamps to local time strings for display
      const timeSlots = data.availableTimeSlots.map((slot: string) => {
        const time = new Date(slot);
        return format(time, 'HH:mm');
      }).sort();
      
      setAvailableTimes(timeSlots);
      
      // If we have available times, select the first one by default
      if (timeSlots.length > 0 && !selectedTime) {
        setSelectedTime(timeSlots[0]);
      } else if (timeSlots.length === 0) {
        setSelectedTime("");
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load available time slots');
      setAvailableTimes([]);
      setSelectedTime("");
    } finally {
      setLoadingAvailability(false);
    }
  };
  
  const handleDateChange = (event: SelectChangeEvent) => {
    const index = parseInt(event.target.value, 10);
    const newDate = dateOptions[index].value;
    setSelectedDate(newDate);
    
    // Clear selected time when changing date
    setSelectedTime("");
  };
  
  const handleTimeChange = (event: SelectChangeEvent) => {
    setSelectedTime(event.target.value);
  };
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    
    try {
      setIsLoading(true);
      
      // Parse the time string and create a full Date object
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);
      
      await onAddToCart(item, bookingDateTime);
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch available time slots when modal opens or date changes
  useEffect(() => {
    if (open && item._id) {
      fetchAvailableTimeSlots(selectedDate);
    }
  }, [open, item._id, selectedDate]);
  
  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedDate(new Date());
      setSelectedTime("");
      setError(null);
    }
  }, [open]);
  
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes} minutes`;
    if (remainingMinutes === 0) return hours === 1 ? `${hours} hour` : `${hours} hours`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  };
  
  const isBookingValid = selectedDate && selectedTime;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {item.productName}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {item.imageUrl && (
            <Grid item xs={12}>
              <Box 
                component="img"
                src={item.imageUrl}
                alt={item.productName}
                sx={{ 
                  width: '100%', 
                  height: 200, 
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>
          </Grid>
          
          {item.vendorBusinessName && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Provided by: {item.vendorBusinessName}
              </Typography>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Clock size={18} />
              <Typography variant="body2">
                Duration: {formatDuration(item.duration)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              ${item.price.toFixed(2)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Calendar size={18} style={{ marginRight: theme.spacing(1) }} />
              <Typography variant="body2">
                Select Date:
              </Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateOptions.findIndex(option => 
                  format(option.value, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                ).toString()}
                onChange={handleDateChange}
                label="Date"
              >
                {dateOptions.map((option, index) => (
                  <MenuItem key={index} value={index.toString()}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Clock size={18} style={{ marginRight: theme.spacing(1) }} />
              <Typography variant="body2">
                Select Time:
              </Typography>
            </Box>
            
            {loadingAvailability ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '56px' }}>
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
                {error}
              </Alert>
            ) : availableTimes.length === 0 ? (
              <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                No available time slots for this date
              </Alert>
            ) : (
              <FormControl fullWidth>
                <InputLabel>Time</InputLabel>
                <Select
                  value={selectedTime}
                  onChange={handleTimeChange}
                  label="Time"
                  disabled={availableTimes.length === 0}
                >
                  {availableTimes.map((time) => (
                    <MenuItem key={time} value={time}>
                      {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
          
          <Grid item xs={12}>
            {selectedDate && selectedTime && (
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 1, 
                bgcolor: 'action.selected',
                mt: 2
              }}>
                <Typography variant="body2">
                  Your booking: {format(selectedDate, 'EEEE, MMM d')} at {format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleBooking} 
          variant="contained" 
          disabled={!isBookingValid || isLoading || loadingAvailability}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PublicBookingItemDetailModal;