import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Sen', kunjungan: 45 },
  { name: 'Sel', kunjungan: 52 },
  { name: 'Rab', kunjungan: 38 },
  { name: 'Kam', kunjungan: 65 },
  { name: 'Jum', kunjungan: 48 },
  { name: 'Sab', kunjungan: 32 },
  { name: 'Min', kunjungan: 18 },
];

export function AppointmentChart() {
  return (
    <div className="stat-card animate-slide-up">
      <h3 className="font-semibold text-lg mb-4">Statistik Kunjungan Mingguan</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="kunjungan" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
