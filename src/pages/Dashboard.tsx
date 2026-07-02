import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentPatients } from '@/components/dashboard/RecentPatients';
import { AppointmentChart } from '@/components/dashboard/AppointmentChart';
import { usePatients } from '@/contexts/PatientContext';

export default function Dashboard() {
  const { patients } = usePatients();
  
  const activePatients = patients.filter(p => p.status === 'active').length;
  const criticalPatients = patients.filter(p => p.status === 'critical').length;

  return (
    <DashboardLayout>
      <Header 
        title="Dashboard" 
        subtitle="Selamat datang kembali! Berikut ringkasan hari ini."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Pasien"
          value={patients.length}
          change="+12% dari bulan lalu"
          changeType="positive"
          icon={Users}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Pasien Aktif"
          value={activePatients}
          change="Sedang dalam perawatan"
          changeType="neutral"
          icon={Activity}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Kunjungan Hari Ini"
          value={28}
          change="+5 dari kemarin"
          changeType="positive"
          icon={Calendar}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Pasien Kritis"
          value={criticalPatients}
          change="Perlu perhatian"
          changeType="negative"
          icon={TrendingUp}
          iconColor="bg-destructive/10 text-destructive"
        />
      </div>

      {/* Charts & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentChart />
        </div>
        <div>
          <RecentPatients />
        </div>
      </div>
    </DashboardLayout>
  );
}
