import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { X, Clock, MapPin, Building } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { BookingItem } from '@/components/booking-item/types/booking-item';
import PublicBookingItemDetailModal from '@/components/calendar/PublicBookingItemDetailModal';

interface ExtendedBookingItem extends BookingItem {
  vendorBusinessName: string;
  latitude?: number;
  longitude?: number;
  location?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  distance?: number;
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  if (lat2 === null || lon2 === null) return Infinity;
  
  const R = 3963; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface BookingItemCardProps {
  booking: ExtendedBookingItem;
  distance: number;
  onClick: () => void;
}

const BookingItemCard: React.FC<BookingItemCardProps> = ({
  booking,
  distance,
  onClick,
}) => {
  const theme = useTheme();
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}min`;
    if (remainingMinutes === 0) return `${hours}hr`;
    return `${hours}hr ${remainingMinutes}min`;
  };
  return (
    <Button
      onClick={onClick}
      sx={{
        width: "100%",
        mb: theme.spacing(1),
        p: theme.spacing(2),
        textAlign: "left",
        display: "block",
        backgroundColor: "background.paper",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <Typography variant="subtitle1" color="text.primary">
        {booking.productName}
      </Typography>
      <Box
        sx={{ display: "flex", gap: theme.spacing(2), mt: theme.spacing(1) }}
      >
        <Typography variant="body2" color="text.secondary">
          <Building 
            size={14}
            style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
          />
          {booking.vendorBusinessName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Clock
            size={14}
            style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
          />
          {formatDuration(booking.duration)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <MapPin
            size={14}
            style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
          />
          {isFinite(distance) ? `${distance.toFixed(1)} mi` : 'Distance unknown'}
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 1 
      }}>
        <Typography 
          variant="body2" 
          color="primary"
          sx={{ fontWeight: 'bold' }}
        >
          ${booking.price.toFixed(2)}
        </Typography>
      </Box>
    </Button>
  );
};

interface NearbyBookingsProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

const NearbyBookings: React.FC<NearbyBookingsProps> = ({
  isOpen,
  onClose,
  latitude,
  longitude,
}) => {
  const theme = useTheme();
  const { t } = useTranslation("booking-items");
  const [bookings, setBookings] = useState<ExtendedBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ExtendedBookingItem | null>(null);

  useEffect(() => {
    const fetchNearbyBookings = async () => {
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const response = await fetch(
          `${API_URL}/booking-items/nearby?` +
          `lat=${latitude}&lng=${longitude}&radius=30&` +
          `startDate=${today.toISOString()}&endDate=${tomorrow.toISOString()}`,
          {
            headers: tokensInfo?.token
              ? { Authorization: `Bearer ${tokensInfo.token}` }
              : {},
          }
        );
        
        if (!response.ok) throw new Error("Failed to fetch nearby bookings");
        const data = await response.json();
        
        const processedBookings = data.data.map((item: ExtendedBookingItem) => {
          let itemLat = item.latitude;
          let itemLng = item.longitude;
          
          if ((!itemLat || !itemLng) && item.location?.coordinates) {
            itemLng = item.location.coordinates[0];
            itemLat = item.location.coordinates[1];
          }
          
          let distance = Infinity;
          if (typeof itemLat === 'number' && typeof itemLng === 'number') {
            distance = calculateDistance(
              latitude,
              longitude,
              itemLat,
              itemLng
            );
          }
          
          return {
            ...item,
            distance
          };
        });
        
        setBookings(processedBookings);
      } catch (error) {
        console.error("Error fetching nearby bookings:", error);
        setError(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && latitude && longitude) {
      fetchNearbyBookings();
    }
  }, [isOpen, latitude, longitude, t]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedItem(null);
    }
  }, [isOpen]);

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      return (a.distance || Infinity) - (b.distance || Infinity);
    });
  }, [bookings]);

  if (!isOpen) return null;
  
  return (
    <Box
      className="modal-content"
      onClick={handleModalClick}
      sx={{
        position: "fixed",
        bottom: { xs: 70, sm: 82 },
        left: { xs: 0, sm: "50%" },
        right: { xs: 0, sm: "auto" },
        height: "75%",
        backgroundColor: "background.paper",
        borderTopLeftRadius: theme.spacing(2),
        borderTopRightRadius: theme.spacing(2),
        transform: { xs: "none", sm: "translateX(-50%)" },
        width: { xs: "100%", sm: "600px" },
        boxShadow: 3,
        zIndex: 75,
        display: "flex",
        flexDirection: "column",
        transition: "bottom 0.3s ease-in-out",
        background: "rgba(17, 25, 40, 0.75)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.125)",
        borderRadius: { xs: "12px 12px 0 0", sm: 2 },
      }}
    >
      <Box
        sx={{
          p: theme.spacing(2),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6">{t("nearbyBookings")}</Typography>
        <IconButton onClick={onClose}>
          <X />
        </IconButton>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: theme.spacing(2),
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : sortedBookings.length === 0 ? (
          <Typography
            color="text.secondary"
            align="center"
            sx={{ py: theme.spacing(4) }}
          >
            {t("noNearbyBookings")}
          </Typography>
        ) : (
          sortedBookings.map((booking) => (
            <BookingItemCard
              key={booking._id}
              booking={booking}
              distance={booking.distance || Infinity}
              onClick={() => setSelectedItem(booking)}
            />
          ))
        )}
      </Box>
      {selectedItem && (
        <Box onClick={(e) => e.stopPropagation()}>
          <PublicBookingItemDetailModal
            item={selectedItem}
            open={true}
            onClose={() => setSelectedItem(null)}
          />
        </Box>
      )}
    </Box>
  );
};

export default NearbyBookings;