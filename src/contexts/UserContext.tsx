import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'dokter' | 'perawat';
  specialization?: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UserContextType {
  users: SystemUser[];
  addUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<SystemUser>) => void;
  deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialUsers: SystemUser[] = [
  { id: '1', name: 'Dr. Admin', email: 'admin@hospital.com', role: 'admin', phone: '081111111111', status: 'active', createdAt: '2024-01-01' },
  { id: '2', name: 'Dr. Budi Santoso', email: 'budi@hospital.com', role: 'dokter', specialization: 'Penyakit Dalam', phone: '082222222222', status: 'active', createdAt: '2024-01-02' },
  { id: '3', name: 'Dr. Sari Wijayanti', email: 'sari@hospital.com', role: 'dokter', specialization: 'Anak', phone: '083333333333', status: 'active', createdAt: '2024-01-03' },
  { id: '4', name: 'Dr. Ahmad Fauzi', email: 'ahmad@hospital.com', role: 'dokter', specialization: 'Endokrinologi', phone: '084444444444', status: 'active', createdAt: '2024-01-04' },
  { id: '5', name: 'Ners Rini Astuti', email: 'rini@hospital.com', role: 'perawat', phone: '085555555555', status: 'active', createdAt: '2024-01-05' },
  { id: '6', name: 'Ners Dewi Kurnia', email: 'dewi@hospital.com', role: 'perawat', phone: '086666666666', status: 'inactive', createdAt: '2024-01-06' },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);

  const addUser = (data: Omit<SystemUser, 'id' | 'createdAt'>) => {
    setUsers(prev => [...prev, { ...data, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }]);
  };

  const updateUser = (id: string, data: Partial<SystemUser>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within UserProvider');
  return context;
}
