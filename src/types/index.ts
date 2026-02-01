export type User = {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  preferences?: Record<string, unknown>;
  createdAt: string;
};

export type Holiday = {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Itinerary = {
  id: string;
  holidayId: string;
  date: string; // YYYY-MM-DD format, must be between holiday start and end date
  activity: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  holidayId: string;
  category: string;
  description?: string;
  amount: number;
  currency: string;
  expenseDate?: string;
  createdAt: string;
};

export type Accommodation = {
  id: string;
  holidayId: string;
  name: string;
  address?: string;
  checkInDate: string;
  checkOutDate: string;
  confirmationNumber?: string;
  price?: number;
  notes?: string;
  createdAt: string;
};

export type TravelCompanion = {
  id: string;
  holidayId: string;
  companionEmail: string;
  companionName?: string;
  role: string;
  createdAt: string;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type AuthError = {
  message: string;
  status?: number;
  code?: string;
};
