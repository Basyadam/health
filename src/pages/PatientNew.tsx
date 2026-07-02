import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { PatientForm } from '@/components/patients/PatientForm';

export default function PatientNew() {
  return (
    <DashboardLayout>
      <Header 
        title="Tambah Pasien Baru" 
        subtitle="Masukkan data pasien baru"
      />

      <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
        <PatientForm mode="create" />
      </div>
    </DashboardLayout>
  );
}
