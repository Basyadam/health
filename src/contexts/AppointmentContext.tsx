import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  medicalRecordNumber: string;
  doctorName: string;
  doctorSpecialization?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, a: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };

const initial: Appointment[] = [
  { id: '1', patientId: '1', patientName: 'Ahmad Wijaya', medicalRecordNumber: 'RM-2024-001', doctorName: 'Dr. Budi Santoso', doctorSpecialization: 'Penyakit Dalam', date: fmt(today), time: '09:00', status: 'confirmed', notes: 'Kontrol hipertensi rutin' },
  { id: '2', patientId: '2', patientName: 'Siti Rahayu', medicalRecordNumber: 'RM-2024-002', doctorName: 'Dr. Sari Wijayanti', doctorSpecialization: 'Anak', date: fmt(today), time: '10:30', status: 'pending', notes: 'Pemeriksaan rutin anak' },
  { id: '3', patientId: '3', patientName: 'Budi Hartono', medicalRecordNumber: 'RM-2024-003', doctorName: 'Dr. Ahmad Fauzi', doctorSpecialization: 'Endokrinologi', date: fmt(today), time: '13:00', status: 'confirmed', notes: 'Kontrol diabetes' },
  { id: '4', patientId: '4', patientName: 'Dewi Lestari', medicalRecordNumber: 'RM-2024-004', doctorName: 'Dr. Budi Santoso', doctorSpecialization: 'Penyakit Dalam', date: addDays(1), time: '08:00', status: 'confirmed' },
  { id: '5', patientId: '5', patientName: 'Eko Prasetyo', medicalRecordNumber: 'RM-2024-005', doctorName: 'Dr. Sari Wijayanti', doctorSpecialization: 'Anak', date: addDays(1), time: '11:00', status: 'pending' },
  { id: '6', patientId: '1', patientName: 'Ahmad Wijaya', medicalRecordNumber: 'RM-2024-001', doctorName: 'Dr. Ahmad Fauzi', doctorSpecialization: 'Endokrinologi', date: addDays(2), time: '14:30', status: 'confirmed' },
  { id: '7', patientId: '2', patientName: 'Siti Rahayu', medicalRecordNumber: 'RM-2024-002', doctorName: 'Dr. Budi Santoso', doctorSpecialization: 'Penyakit Dalam', date: addDays(-1), time: '15:00', status: 'completed', notes: 'Selesai konsultasi' },
];

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initial);

  const addAppointment = (a: Omit<Appointment, 'id'>) => {
    setAppointments(prev => [...prev, { ...a, id: Date.now().toString() }]);
  };
  const updateAppointment = (id: string, a: Partial<Appointment>) => {
    setAppointments(prev => prev.map(x => (x.id === id ? { ...x, ...a } : x)));
  };
  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(x => x.id !== id));
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, updateAppointment, deleteAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointments must be used within AppointmentProvider');
  return ctx;
}
