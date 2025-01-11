//import { useState } from "react";
import Box from "@mui/material/Box";
//import Button from "@mui/material/Button";
//import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Calendar } from "@/components/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { VendorProfileDetails, RentalProduct } from "@/types/vendor-types";
import { CalendarEvent } from "@/components/calendar/types";

const createRentalEvents = (rentals: RentalProduct[]): CalendarEvent[] => {
  return rentals.flatMap(rental => {
    const events: CalendarEvent[] = [];

    // Due In Events
    if (rental.dueIn > 0) {
      events.push({
        id: `return-${rental.id}`,
        title: `${rental.name} Return`,
        start: new Date(), 
        type: 'rental',
        status: 'booked',
        metadata: {
          type: 'rental',
          data: {
            itemName: rental.name,
            condition: rental.condition,
            pickupLocation: 'Main Store',
            price: rental.sizes[0]?.pricePerDay || 0,
            notes: `${rental.dueIn} units due`
          }
        }
      });
    }

    // Due Out Events
    if (rental.dueOut > 0) {
      events.push({
        id: `pickup-${rental.id}`,
        title: `${rental.name} Pickup`,
        start: new Date(), 
        type: 'rental',
        status: 'booked',
        metadata: {
          type: 'rental',
          data: {
            itemName: rental.name,
            condition: rental.condition,
            pickupLocation: 'Main Store',
            price: rental.sizes[0]?.pricePerDay || 0,
            notes: `${rental.dueOut} units to pickup`
          }
        }
      });
    }

    // Maintenance Events
    rental.maintenanceSchedule.forEach((maintenance) => {
      events.push({
        id: `maintenance-${maintenance.id}`,
        title: `Maintenance: ${rental.name}`,
        start: new Date(maintenance.startDate),
        end: new Date(maintenance.endDate),
        type: 'rental',
        status: 'booked',
        metadata: {
          type: 'rental',
          data: {
            itemName: rental.name,
            condition: rental.condition,
            pickupLocation: 'Maintenance Area',
            price: 0,
            notes: maintenance.reason
          }
        }
      });
    });

    return events;
  });
};

export function CalendarSection({ vendor }: { vendor: VendorProfileDetails }) {
  
  if (!vendor.rentals || vendor.rentals.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            No rental items available for calendar view
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const events = vendor.rentals ? createRentalEvents(vendor.rentals) : [];

  return (
    <Card>
      <CardContent>
        <Box className="flex items-center gap-2 mb-4">
          <CalendarIcon className="text-primary" size={24} />
          <Typography variant="h6">Rental Calendar</Typography>
        </Box>
        <Calendar 
          events={events} 
          initialView="week" 
          height="600px"
          // Add default date prop to ensure consistency
          initialDate={new Date()} 
        />
      </CardContent>
    </Card>
  );
}