export enum RentalStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

export interface Rental {
  id: number;
  carId: number;
  customerId: number;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  totalCost: number;
  status: RentalStatus;
  returnedAt: Date | null;
  createdAt: Date;
}
