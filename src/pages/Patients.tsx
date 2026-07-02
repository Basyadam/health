import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { PatientTable } from '@/components/patients/PatientTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Patients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DashboardLayout>
      <Header 
        title="Manajemen Pasien" 
        subtitle="Kelola data pasien rumah sakit"
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau No. RM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => navigate('/patients/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pasien
          </Button>
        </div>
      </div>

      {/* Patient Table */}
      <PatientTable searchQuery={searchQuery} />
    </DashboardLayout>
  );
}
