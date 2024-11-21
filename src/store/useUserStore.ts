import { create } from "zustand";

interface Reservation {
  id: string;
  pickupLocation: string;
  dropOffLocation: string;
  pickupDateTime: Date;
  dropOffDateTime: Date;
  reservationStatus: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "LATE";
  vehicle: Vehicle;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  transmission: "AUTOMATIC" | "MANUAL";
  maintenance: "IN_MAINTENANCE" | "OUT_OF_SERVICE" | "IN_SERVICE";
  pricePerDay: number;
  city: string;
  state: string;
  year: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  dob: Date;
  phone: string;
  driversLicense: string;
  city: string;
  state: string;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  reservations: Reservation[];
}

interface UserState {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
