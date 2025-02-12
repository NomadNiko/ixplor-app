"use client";
import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { X, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";
import { useTheme } from "@mui/material/styles";
import { Image } from "@nextui-org/react";
import VendorFullView from './vendor-full';

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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

interface VendorItemProps {
  vendor: Vendor;
  distance: number;
  onClick: () => void;
}

const VendorItem: React.FC<VendorItemProps> = ({
  vendor,
  distance,
  onClick,
}) => {
  const theme = useTheme();

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {vendor.logoUrl && (
          <Box sx={{ width: 40, height: 40, flexShrink: 0 }}>
            <Image
              src={vendor.logoUrl}
              alt={vendor.businessName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" color="text.primary">
            {vendor.businessName}
          </Typography>
          <Box sx={{ display: "flex", gap: theme.spacing(2), mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <Phone
                size={14}
                style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
              />
              {vendor.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <MapPin
                size={14}
                style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
              />
              {distance.toFixed(1)} mi
            </Typography>
          </Box>
        </Box>
      </Box>
    </Button>
  );
};

interface NearbyVendorsProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  vendors: Vendor[]; // Now accepting vendors as a prop
}

const NearbyVendors: React.FC<NearbyVendorsProps> = ({
    isOpen,
    onClose,
    latitude,
    longitude,
    vendors
  }) => {
    const theme = useTheme();
    const { t } = useTranslation("home");
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const RADIUS_MILES = 30; // Max distance to show vendors
  
    useEffect(() => {
      if (!isOpen) {
        setSelectedVendor(null);
      }
    }, [isOpen]);
  
    const handleModalClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };
  
    const sortedVendors = useMemo(() => {
      return vendors
        .filter(vendor => {
          if (vendor.vendorStatus !== VendorStatusEnum.APPROVED) return false;
          
          const distance = calculateDistance(
            latitude,
            longitude,
            vendor.location.coordinates[1],
            vendor.location.coordinates[0]
          );
          
          return distance <= RADIUS_MILES;
        })
        .map(vendor => ({
          ...vendor,
          distance: calculateDistance(
            latitude,
            longitude,
            vendor.location.coordinates[1],
            vendor.location.coordinates[0]
          )
        }))
        .sort((a, b) => (a.distance - b.distance));
    }, [vendors, latitude, longitude]);
  
    if (!isOpen) return null;
  
    return (
      <>
        <Box
          className="modal-content"
          onClick={handleModalClick}
          sx={{
            position: "fixed",
            bottom: { xs: 70, md: 82 },
            left: { xs: 0, md: '50%' },
            right: { xs: 0, md: 'auto' },
            height: "75%",
            backgroundColor: "background.paper",
            borderTopLeftRadius: theme.spacing(2),
            borderTopRightRadius: theme.spacing(2),
            transform: { xs: 'none', md: 'translateX(-50%)' },
            width: { xs: '100%', sm: '600px' },
            boxShadow: 3,
            zIndex: 75,
            display: "flex",
            flexDirection: "column",
            transition: "bottom 0.3s ease-in-out",
            background: "rgba(17, 25, 40, 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.125)",
            borderRadius: { xs: "12px 12px 0 0", md: 2 },
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
            <Typography variant="h6">{t("nearbyVendors")}</Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}
            >
              <IconButton onClick={onClose}>
                <X />
              </IconButton>
            </Box>
          </Box>
  
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: theme.spacing(2),
            }}
          >
            {sortedVendors.length === 0 ? (
              <Typography
                color="text.secondary"
                align="center"
                sx={{ py: theme.spacing(4) }}
              >
                {t("noNearbyVendors")}
              </Typography>
            ) : (
              sortedVendors.map((vendor) => (
                <VendorItem
                  key={vendor._id}
                  vendor={vendor}
                  distance={vendor.distance}
                  onClick={() => setSelectedVendor(vendor)}
                />
              ))
            )}
          </Box>
        </Box>
  
        {selectedVendor && (
          <VendorFullView
            vendor={selectedVendor}
            onClose={() => setSelectedVendor(null)}
          />
        )}
      </>
    );
  };
  
  export default NearbyVendors;