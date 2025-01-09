export interface FinancialMetric {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }
  
  export interface BaseFinancialData {
    id: string;
    vendorId: string;
    vendorName: string;
    vendorType: 'tours' | 'tickets' | 'rentals' | 'lessons';
    period: string;
    availableBalance: FinancialMetric;
    pendingBalance: FinancialMetric;
    lifetimeRevenue: FinancialMetric;
    lastUpdated: string;
  }
  
  export interface ToursFinancialData extends BaseFinancialData {
    vendorType: 'tours';
    tourBookings: {
      completed: number;
      upcoming: number;
      canceled: number;
      revenue: number[];
      dates: string[];
    };
    customerSatisfaction: number;
    averageBookingValue: number;
  }
  
  export interface TicketsFinancialData extends BaseFinancialData {
    vendorType: 'tickets';
    ticketSales: {
      daily: number;
      weekly: number;
      monthly: number;
      revenue: number[];
      dates: string[];
    };
    redemptionRate: number;
    salesByType: {
      name: string;
      value: number;
    }[];
  }
  
  export interface RentalsFinancialData extends BaseFinancialData {
    vendorType: 'rentals';
    rentalMetrics: {
      activeRentals: number;
      overdueRentals: number;
      maintenanceCosts: number;
      utilization: number;
      revenue: number[];
      dates: string[];
    };
    equipmentValue: number;
  }
  
  export interface LessonsFinancialData extends BaseFinancialData {
    vendorType: 'lessons';
    lessonMetrics: {
      completedLessons: number;
      upcomingLessons: number;
      canceledLessons: number;
      revenue: number[];
      dates: string[];
    };
    instructorPayouts: number;
    studentRetentionRate: number;
  }
  
  export type VendorFinancialData = ToursFinancialData | TicketsFinancialData | RentalsFinancialData | LessonsFinancialData;
  
  export interface AggregateFinancialData {
    totalBalance: FinancialMetric;
    totalPending: FinancialMetric;
    totalRevenue: FinancialMetric;
    revenueByType: {
      name: string;
      value: number;
    }[];
    dailyRevenue: {
      date: string;
      tours: number;
      tickets: number;
      rentals: number;
      lessons: number;
    }[];
  }