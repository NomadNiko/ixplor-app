export interface ShiftData {
    startDateTime: Date;
    endDateTime: Date;
  }
  
  export interface StaffShift {
    _id: string;
    startDateTime: Date;
    endDateTime: Date;
    staffId: string;
  }