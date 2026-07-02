import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Patient {
  id: string;
  medicalRecordNumber: string;
  name: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  phone: string;
  status: 'active' | 'inactive' | 'critical';
  createdAt: string;
  lastVisit?: string;
}

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Mock data
const initialPatients: Patient[] = [
  {
    id: '1',
    medicalRecordNumber: 'RM-2024-001',
    name: 'Ahmad Wijaya',
    birthDate: '1985-03-15',
    gender: 'Laki-laki',
    address: 'Jl. Sudirman No. 123, Jakarta',
    phone: '081234567890',
    status: 'active',
    createdAt: '2024-01-15',
    lastVisit: '2024-01-20',
  },
  {
    id: '2',
    medicalRecordNumber: 'RM-2024-002',
    name: 'Siti Rahayu',
    birthDate: '1990-07-22',
    gender: 'Perempuan',
    address: 'Jl. Gatot Subroto No. 45, Jakarta',
    phone: '082345678901',
    status: 'active',
    createdAt: '2024-01-16',
    lastVisit: '2024-01-21',
  },
  {
    id: '3',
    medicalRecordNumber: 'RM-2024-003',
    name: 'Budi Hartono',
    birthDate: '1978-11-08',
    gender: 'Laki-laki',
    address: 'Jl. Thamrin No. 67, Jakarta',
    phone: '083456789012',
    status: 'critical',
    createdAt: '2024-01-17',
    lastVisit: '2024-01-22',
  },
  {
    id: '4',
    medicalRecordNumber: 'RM-2024-004',
    name: 'Dewi Lestari',
    birthDate: '1995-02-28',
    gender: 'Perempuan',
    address: 'Jl. Kuningan No. 89, Jakarta',
    phone: '084567890123',
    status: 'inactive',
    createdAt: '2024-01-18',
  },
  {
    id: '5',
    medicalRecordNumber: 'RM-2024-005',
    name: 'Eko Prasetyo',
    birthDate: '1982-09-12',
    gender: 'Laki-laki',
    address: 'Jl. Rasuna Said No. 101, Jakarta',
    phone: '085678901234',
    status: 'active',
    createdAt: '2024-01-19',
    lastVisit: '2024-01-23',
  },
];

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, patientData: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...patientData } : p))
    );
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const getPatient = (id: string) => {
    return patients.find(p => p.id === id);
  };

  return (
    <PatientContext.Provider
      value={{ patients, addPatient, updatePatient, deletePatient, getPatient }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}
