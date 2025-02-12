import { useState } from 'react';
import { Store, FerrisWheel, Ticket, Receipt } from "lucide-react";
import Box from "@mui/material/Box";
import { NavButton } from "./styled-components";
import NearbyActivities from '@/components/product-item/NearbyActivities';
import NearbyVendors from '../vendor/NearbyVendors';
import { Vendor } from "@/app/[language]/types/vendor";

export const BottomNav = ({ currentLocation, vendors }: { 
  currentLocation: { latitude: number; longitude: number };
  vendors: Vendor[]; 
}) => {
  const [showNearbyActivities, setShowNearbyActivities] = useState(false);
  const [showNearbyVendors, setShowNearbyVendors] = useState(false);

  return (
    <>
      <Box
        sx={{
          width: { xs: '100%', sm: '600px' },
          position: "fixed",
          bottom: { xs: 0, md: 5 },
          left: { xs: 0, md: '50%' },
          right: { xs: 0, md: 'auto' },
          padding: (theme) => theme.spacing(2),
          backgroundColor: (theme) => theme.palette.background.glass,
          backdropFilter: "blur(10px)",
          borderRadius: { xs: 0, md: 2 },
          transform: { xs: 'none', md: 'translateX(-50%)' },
          zIndex: 80,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            height: (theme) => theme.spacing(5),
          }}
        >
          
          <NavButton onClick={() => setShowNearbyActivities(true)}>
            <FerrisWheel />
          </NavButton>
          <NavButton onClick={() => setShowNearbyVendors(true)}>
            <Store />
          </NavButton>
          <NavButton>
            <Ticket />
          </NavButton>
          <NavButton>
            <Receipt />
          </NavButton>
        </Box>
      </Box>

      <NearbyActivities
        isOpen={showNearbyActivities}
        onClose={() => setShowNearbyActivities(false)}
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
      />
      <NearbyVendors
        isOpen={showNearbyVendors}
        onClose={() => setShowNearbyVendors(false)}
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        vendors={vendors}
      />
    </>
  );
};

export default BottomNav;