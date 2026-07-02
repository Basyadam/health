import { useParams, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { PatientForm } from '@/components/patients/PatientForm';
import { usePatients } from '@/contexts/PatientContext';

export default function PatientEdit() {
  const { id } = useParams<{ id: string }>();
  const { getPatient } = usePatients();
  
  const patient = id ? getPatient(id) : undefined;

  if (!patient) {
    return <Navigate to="/patients" replace />;
  }

  return (
    <DashboardLayout>
      <Header 
        title="Edit Pasien" 
        subtitle={`Edit data ${patient.name}`}
      />

      <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
        <PatientForm patient={patient} mode="edit" />
      </div>
    </DashboardLayout>
  );
}
