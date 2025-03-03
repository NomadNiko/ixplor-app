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
import { addDays } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { BookingItem } from '@/components/booking-item/types/booking-item';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { useCartQuery, AddBookingToCartData } from '@/hooks/use-cart-query';

interface ExtendedBookingItem extends BookingItem {
  vendorBusinessName?: string;
  productDate?: string;
}

interface PublicBookingItemDetailModalProps {
  item: ExtendedBookingItem;
  open: boolean;
  onClose: () => void;
}

const PublicBookingItemDetailModal = ({ 
  item, 
  open, 
  onClose
}: PublicBookingItemDetailModalProps) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addBookingItem, refreshCart } = useCartQuery();
  
  const dateOptions = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = addDays(new Date(), i);
      return {
        value: date,
        label: date.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };
    });
  }, []);
  
  const fetchAvailableTimeSlots = async (date: Date) => {
    setLoadingAvailability(true);
    setError(null);
    
    try {
      const formattedDate = date.toISOString().split('T')[0]; // yyyy-MM-dd format
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
      
      const timeSlots = data.availableTimeSlots.map((slot: string) => {
        const timeDate = new Date(slot);
        return `${timeDate.getHours().toString().padStart(2, '0')}:${timeDate.getMinutes().toString().padStart(2, '0')}`;
      }).sort();
      
      setAvailableTimes(timeSlots);
      
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
    
    setSelectedTime("");
  };
  
  const handleTimeChange = (event: SelectChangeEvent) => {
    setSelectedTime(event.target.value);
  };
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    
    try {
      setIsLoading(true);
      
      // Create bookingDateTime with proper timezone handling
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);
      
      const bookingData: AddBookingToCartData = {
        bookingItemId: item._id,
        startDateTime: bookingDateTime,
        duration: item.duration,
        vendorId: item.vendorId
      };
      
      await addBookingItem(bookingData);
      refreshCart();
      onClose();
    } catch (error) {
      console.error('Error adding booking to cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (open && item._id) {
      fetchAvailableTimeSlots(selectedDate);
    }
  }, [open, item._id, selectedDate]);
  
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
  
  // Function to format time display
  const formatTimeDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const timeObj = new Date();
    timeObj.setHours(hours, minutes, 0, 0);
    
    return timeObj.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
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
          
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Grid>
          )}
          
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
                  option.value.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
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
                      {formatTimeDisplay(time)}
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
                  Your booking: {selectedDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })} at {formatTimeDisplay(selectedTime)}
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