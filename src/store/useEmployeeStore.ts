import { create } from "zustand";

interface EmployeeState {
  employee: any | null;
  setEmployee: (employee: any) => void;
  clearEmployee: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: null,
  setEmployee: (employee) => set({ employee }),
  clearEmployee: () => set({ employee: null }),
}));
