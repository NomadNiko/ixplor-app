import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import { Calendar } from '@/components/calendar';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { RentalProduct, MaintenanceScheduleItem, VendorProfileDetails } from '@/types/vendor-types';
import { addMonths, subMonths, format } from 'date-fns';
import { CalendarView, CalendarEvent } from '@/components/calendar/types';

const createRentalEvents = (rentals: RentalProduct[]): CalendarEvent[] => {
  return rentals.flatMap(rental => {
    const events: CalendarEvent[] = [];

    // Due In Events
    if (rental.dueIn > 0) {
      events.push({
        id: `return-${rental.id}`,
        title: `${rental.name} Return`,
        start: new Date(), // Backend should provide precise date
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
    rental.maintenanceSchedule.forEach((maintenance: MaintenanceScheduleItem) => {
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

export function RentalCalendarView({ rentals }: { rentals: RentalProduct[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');

  const events = createRentalEvents(rentals);

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' 
        ? subMonths(prev, 1) 
        : addMonths(prev, 1)
    );
  };

  return (
    <Card className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Box className="flex items-center gap-2">
          <CalendarIcon className="text-primary" size={24} />
          <Typography variant="h6">Rental Calendar</Typography>
        </Box>
        <Box className="flex items-center gap-4">
          <ButtonGroup>
            {(['week', 'month'] as CalendarView[]).map(viewOption => (
              <Button
                key={viewOption}
                variant={view === viewOption ? 'contained' : 'outlined'}
                onClick={() => setView(viewOption)}
              >
                {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
          <Box className="flex items-center gap-2">
            <Button
              variant="outlined"
              onClick={() => handleDateNavigation('prev')}
            >
              <ChevronLeft size={20} />
            </Button>
            <Typography>
              {format(currentDate, 'MMMM yyyy')}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => handleDateNavigation('next')}
            >
              <ChevronRight size={20} />
            </Button>
          </Box>
        </Box>
      </Box>

      <Calendar
        events={events}
        initialView={view}
        initialDate={currentDate}
        height="600px"
      />
    </Card>
  );
}

// Use in RentalEditSection and RentalView components
export function RentalCalendarSection({ vendor }: { vendor: VendorProfileDetails }) {
  if (!vendor.rentals || vendor.rentals.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        No rental items available for calendar view
      </Typography>
    );
  }

  return <RentalCalendarView rentals={vendor.rentals} />;
}