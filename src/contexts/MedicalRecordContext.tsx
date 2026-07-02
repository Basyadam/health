import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  medicalRecordNumber: string;
  doctorName: string;
  visitDate: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes?: string;
}

interface MedicalRecordContextType {
  records: MedicalRecord[];
  addRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  updateRecord: (id: string, record: Partial<MedicalRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecord: (id: string) => MedicalRecord | undefined;
}

const MedicalRecordContext = createContext<MedicalRecordContextType | undefined>(undefined);

const initialRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Ahmad Wijaya',
    medicalRecordNumber: 'RM-2024-001',
    doctorName: 'Dr. Budi Santoso',
    visitDate: '2024-01-20',
    diagnosis: 'Hipertensi Grade 1',
    treatment: 'Kontrol tekanan darah, diet rendah garam',
    prescription: 'Amlodipine 5mg 1x1, Captopril 25mg 2x1',
    notes: 'Pasien diminta kontrol kembali dalam 2 minggu',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Siti Rahayu',
    medicalRecordNumber: 'RM-2024-002',
    doctorName: 'Dr. Sari Wijayanti',
    visitDate: '2024-01-21',
    diagnosis: 'ISPA (Infeksi Saluran Pernapasan Atas)',
    treatment: 'Istirahat, banyak minum air putih',
    prescription: 'Paracetamol 500mg 3x1, Ambroxol 30mg 3x1',
    notes: 'Demam dan batuk selama 3 hari',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Budi Hartono',
    medicalRecordNumber: 'RM-2024-003',
    doctorName: 'Dr. Ahmad Fauzi',
    visitDate: '2024-01-22',
    diagnosis: 'Diabetes Mellitus Tipe 2',
    treatment: 'Diet diabetes, olahraga teratur, monitoring gula darah',
    prescription: 'Metformin 500mg 2x1, Glimepiride 2mg 1x1',
    notes: 'Gula darah sewaktu 280 mg/dL, perlu monitoring ketat',
  },
];

export function MedicalRecordProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);

  const addRecord = (data: Omit<MedicalRecord, 'id'>) => {
    setRecords(prev => [...prev, { ...data, id: Date.now().toString() }]);
  };

  const updateRecord = (id: string, data: Partial<MedicalRecord>) => {
    setRecords(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const getRecord = (id: string) => records.find(r => r.id === id);

  return (
    <MedicalRecordContext.Provider value={{ records, addRecord, updateRecord, deleteRecord, getRecord }}>
      {children}
    </MedicalRecordContext.Provider>
  );
}

export function useMedicalRecords() {
  const context = useContext(MedicalRecordContext);
  if (!context) throw new Error('useMedicalRecords must be used within MedicalRecordProvider');
  return context;
}
