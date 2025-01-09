import { 
    AggregateFinancialData, 
    ToursFinancialData, 
    TicketsFinancialData, 
    RentalsFinancialData, 
    LessonsFinancialData 
  } from './finance-types';
  
  const generateDailyRevenue = (days: number, baseValue: number) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        value: baseValue + Math.random() * 1000,
        date: date.toISOString().split('T')[0]
      };
    });
  };
  
  export const mockToursData: ToursFinancialData = {
    id: "t1",
    vendorId: "1",
    vendorName: "Mountain Edge Tours",
    vendorType: "tours",
    period: "2024-01",
    availableBalance: { value: 25000, change: 12.5, trend: 'up' },
    pendingBalance: { value: 5000, change: -2.3, trend: 'down' },
    lifetimeRevenue: { value: 125000, change: 15.7, trend: 'up' },
    lastUpdated: "2024-01-08T09:00:00Z",
    tourBookings: {
      completed: 145,
      upcoming: 67,
      canceled: 12,
      revenue: generateDailyRevenue(30, 800).map(d => d.value),
      dates: generateDailyRevenue(30, 800).map(d => d.date)
    },
    customerSatisfaction: 4.8,
    averageBookingValue: 299
  };
  
  export const mockTicketsData: TicketsFinancialData = {
    id: "t2",
    vendorId: "2",
    vendorName: "Peak Pass Sales",
    vendorType: "tickets",
    period: "2024-01",
    availableBalance: { value: 45000, change: 23.4, trend: 'up' },
    pendingBalance: { value: 7500, change: 5.6, trend: 'up' },
    lifetimeRevenue: { value: 275000, change: 28.9, trend: 'up' },
    lastUpdated: "2024-01-08T09:00:00Z",
    ticketSales: {
      daily: 234,
      weekly: 1456,
      monthly: 5789,
      revenue: generateDailyRevenue(30, 1200).map(d => d.value),
      dates: generateDailyRevenue(30, 1200).map(d => d.date)
    },
    redemptionRate: 0.87,
    salesByType: [
      { name: 'Day Pass', value: 45 },
      { name: 'Season Pass', value: 30 },
      { name: 'Multi-Day', value: 25 }
    ]
  };
  
  export const mockRentalsData: RentalsFinancialData = {
    id: "r1",
    vendorId: "3",
    vendorName: "Mountain Rentals",
    vendorType: "rentals",
    period: "2024-01",
    availableBalance: { value: 15000, change: 8.9, trend: 'up' },
    pendingBalance: { value: 2500, change: -1.2, trend: 'down' },
    lifetimeRevenue: { value: 89000, change: 12.4, trend: 'up' },
    lastUpdated: "2024-01-08T09:00:00Z",
    rentalMetrics: {
      activeRentals: 78,
      overdueRentals: 3,
      maintenanceCosts: 1200,
      utilization: 0.82,
      revenue: generateDailyRevenue(30, 500).map(d => d.value),
      dates: generateDailyRevenue(30, 500).map(d => d.date)
    },
    equipmentValue: 125000
  };
  
  export const mockLessonsData: LessonsFinancialData = {
    id: "l1",
    vendorId: "4",
    vendorName: "Pro Lessons",
    vendorType: "lessons",
    period: "2024-01",
    availableBalance: { value: 18000, change: 15.7, trend: 'up' },
    pendingBalance: { value: 3500, change: 2.8, trend: 'up' },
    lifetimeRevenue: { value: 95000, change: 18.9, trend: 'up' },
    lastUpdated: "2024-01-08T09:00:00Z",
    lessonMetrics: {
      completedLessons: 89,
      upcomingLessons: 34,
      canceledLessons: 5,
      revenue: generateDailyRevenue(30, 600).map(d => d.value),
      dates: generateDailyRevenue(30, 600).map(d => d.date)
    },
    instructorPayouts: 45000,
    studentRetentionRate: 0.76
  };
  
  export const mockAggregateData: AggregateFinancialData = {
    totalBalance: { value: 103000, change: 15.1, trend: 'up' },
    totalPending: { value: 18500, change: 1.2, trend: 'up' },
    totalRevenue: { value: 584000, change: 18.9, trend: 'up' },
    revenueByType: [
      { name: 'Tours', value: 125000 },
      { name: 'Tickets', value: 275000 },
      { name: 'Rentals', value: 89000 },
      { name: 'Lessons', value: 95000 }
    ],
    dailyRevenue: generateDailyRevenue(30, 3000).map(day => ({
      date: day.date,
      tours: Math.random() * 1000,
      tickets: Math.random() * 1500,
      rentals: Math.random() * 800,
      lessons: Math.random() * 600
    }))
  };
  
  export const mockVendorFinancialData = [
    mockToursData,
    mockTicketsData,
    mockRentalsData,
    mockLessonsData
  ];