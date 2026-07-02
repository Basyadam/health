import { usePatients } from '@/contexts/PatientContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function RecentPatients() {
  const { patients } = usePatients();
  const recentPatients = patients.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="badge-success">Aktif</Badge>;
      case 'critical':
        return <Badge className="badge-danger">Kritis</Badge>;
      case 'inactive':
        return <Badge className="badge-warning">Tidak Aktif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="stat-card animate-slide-up">
      <h3 className="font-semibold text-lg mb-4">Pasien Terbaru</h3>
      <div className="space-y-4">
        {recentPatients.map((patient, index) => (
          <div 
            key={patient.id}
            className={cn(
              'flex items-center justify-between py-3',
              index !== recentPatients.length - 1 && 'border-b border-border'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {patient.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{patient.name}</p>
                <p className="text-sm text-muted-foreground">{patient.medicalRecordNumber}</p>
              </div>
            </div>
            {getStatusBadge(patient.status)}
          </div>
        ))}
      </div>
    </div>
  );
}
