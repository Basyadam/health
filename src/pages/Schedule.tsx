import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Stethoscope, Pencil, Trash2, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useAppointments, Appointment } from '@/contexts/AppointmentContext';
import { usePatients } from '@/contexts/PatientContext';
import { useUsers } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

const statusConfig = {
  pending: { label: 'Menunggu', className: 'badge-warning' },
  confirmed: { label: 'Dikonfirmasi', className: 'badge-info' },
  completed: { label: 'Selesai', className: 'badge-success' },
  cancelled: { label: 'Dibatalkan', className: 'badge-danger' },
};

const emptyForm = {
  patientId: '',
  doctorName: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  time: '09:00',
  status: 'pending' as Appointment['status'],
  notes: '',
};

export default function Schedule() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { patients } = usePatients();
  const { users } = useUsers();
  const doctors = users.filter(u => u.role === 'dokter');

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days: Date[] = [];
    let d = gridStart;
    while (d <= gridEnd) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  }, [currentMonth]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach(a => {
      const arr = map.get(a.date) || [];
      arr.push(a);
      map.set(a.date, arr);
    });
    return map;
  }, [appointments]);

  const selectedDateAppointments = useMemo(() => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    return (appointmentsByDate.get(key) || []).sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, appointmentsByDate]);

  const stats = useMemo(() => {
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    const todays = appointments.filter(a => a.date === todayKey);
    return {
      today: todays.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
    };
  }, [appointments]);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm, date: format(selectedDate, 'yyyy-MM-dd') });
    setDialogOpen(true);
  };

  const openEdit = (a: Appointment) => {
    setEditId(a.id);
    setForm({
      patientId: a.patientId,
      doctorName: a.doctorName,
      date: a.date,
      time: a.time,
      status: a.status,
      notes: a.notes || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const patient = patients.find(p => p.id === form.patientId);
    const doctor = doctors.find(d => d.name === form.doctorName);
    if (!patient || !doctor) {
      toast({ title: 'Lengkapi data', description: 'Pasien dan dokter wajib dipilih', variant: 'destructive' });
      return;
    }
    const data = {
      ...form,
      patientName: patient.name,
      medicalRecordNumber: patient.medicalRecordNumber,
      doctorSpecialization: doctor.specialization,
    };
    if (editId) {
      updateAppointment(editId, data);
      toast({ title: 'Berhasil', description: 'Jadwal diperbarui' });
    } else {
      addAppointment(data);
      toast({ title: 'Berhasil', description: 'Jadwal ditambahkan' });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAppointment(deleteId);
      toast({ title: 'Berhasil', description: 'Jadwal dihapus' });
      setDeleteId(null);
    }
  };

  const quickStatus = (id: string, status: Appointment['status']) => {
    updateAppointment(id, { status });
    toast({ title: 'Status diperbarui', description: `Jadwal ditandai ${statusConfig[status].label.toLowerCase()}` });
  };

  const weekDayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <DashboardLayout>
      <Header title="Jadwal Praktik" subtitle="Kelola jadwal kunjungan dan praktik dokter" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hari Ini</p>
              <p className="text-2xl font-bold mt-1">{stats.today}</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10"><CalendarIcon className="w-5 h-5 text-primary" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Menunggu</p>
              <p className="text-2xl font-bold mt-1 text-warning">{stats.pending}</p>
            </div>
            <div className="p-2 rounded-lg bg-warning/10"><Clock className="w-5 h-5 text-warning" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dikonfirmasi</p>
              <p className="text-2xl font-bold mt-1 text-info">{stats.confirmed}</p>
            </div>
            <div className="p-2 rounded-lg bg-info/10"><CheckCircle2 className="w-5 h-5 text-info" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selesai</p>
              <p className="text-2xl font-bold mt-1 text-success">{stats.completed}</p>
            </div>
            <div className="p-2 rounded-lg bg-success/10"><CheckCircle2 className="w-5 h-5 text-success" /></div>
          </div>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')} className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
            <TabsTrigger value="list">Daftar</TabsTrigger>
          </TabsList>
          <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Tambah Jadwal</Button>
        </div>

        {/* CALENDAR VIEW */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold capitalize">
                  {format(currentMonth, 'MMMM yyyy', { locale: localeId })}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }}>
                    Hari Ini
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Weekday header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDayLabels.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const dayAppts = appointmentsByDate.get(key) || [];
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'min-h-[80px] p-2 rounded-lg border text-left transition-all',
                        'hover:border-primary hover:shadow-sm',
                        isCurrentMonth ? 'bg-card' : 'bg-muted/30 text-muted-foreground',
                        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          'text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full',
                          isToday && 'bg-primary text-primary-foreground',
                        )}>
                          {format(day, 'd')}
                        </span>
                        {dayAppts.length > 0 && (
                          <span className="text-xs font-medium text-primary">{dayAppts.length}</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayAppts.slice(0, 2).map(a => (
                          <div key={a.id} className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary truncate">
                            {a.time} {a.patientName}
                          </div>
                        ))}
                        {dayAppts.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayAppts.length - 2} lagi</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side panel: selected day appointments */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Jadwal pada</p>
                <h3 className="text-lg font-semibold capitalize">
                  {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: localeId })}
                </h3>
              </div>

              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Tidak ada jadwal</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={openAdd}>
                    <Plus className="w-4 h-4 mr-1" />Tambah
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {selectedDateAppointments.map(a => (
                    <div key={a.id} className="border border-border rounded-lg p-3 hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{a.time}</span>
                        </div>
                        <Badge className={statusConfig[a.status].className}>{statusConfig[a.status].label}</Badge>
                      </div>
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-medium">{a.patientName}</span>
                          <span className="text-xs text-muted-foreground">({a.medicalRecordNumber})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Stethoscope className="w-3.5 h-3.5" />
                          {a.doctorName}
                          {a.doctorSpecialization && <span className="text-xs">• {a.doctorSpecialization}</span>}
                        </div>
                      </div>
                      {a.notes && <p className="text-xs text-muted-foreground italic mb-2">"{a.notes}"</p>}
                      <div className="flex gap-2 pt-2 border-t border-border">
                        {a.status !== 'completed' && a.status !== 'cancelled' && (
                          <>
                            {a.status === 'pending' && (
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickStatus(a.id, 'confirmed')}>
                                <CheckCircle2 className="w-3 h-3 mr-1" />Konfirmasi
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickStatus(a.id, 'completed')}>
                              Selesai
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 ml-auto">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem onClick={() => openEdit(a)}><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => quickStatus(a.id, 'cancelled')}>
                              <XCircle className="w-4 h-4 mr-2" />Batalkan
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteId(a.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* LIST VIEW */}
        <TabsContent value="list">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {[...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).map(a => (
                <div key={a.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px] p-2 rounded-lg bg-primary/10">
                      <p className="text-xs text-primary font-medium uppercase">{format(new Date(a.date), 'MMM', { locale: localeId })}</p>
                      <p className="text-xl font-bold text-primary">{format(new Date(a.date), 'd')}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">{a.time}</span>
                        <Badge className={statusConfig[a.status].className}>{statusConfig[a.status].label}</Badge>
                      </div>
                      <p className="font-semibold">{a.patientName} <span className="text-xs text-muted-foreground font-normal">({a.medicalRecordNumber})</span></p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5" />{a.doctorName}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => openEdit(a)}><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        {a.status !== 'completed' && (
                          <DropdownMenuItem onClick={() => quickStatus(a.id, 'completed')}>
                            <CheckCircle2 className="w-4 h-4 mr-2" />Tandai Selesai
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setDeleteId(a.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">Belum ada jadwal</div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</DialogTitle>
            <DialogDescription>Atur jadwal kunjungan pasien</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Pasien</Label>
              <Select value={form.patientId} onValueChange={v => setForm({ ...form, patientId: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih pasien" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.medicalRecordNumber})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Dokter</Label>
              <Select value={form.doctorName} onValueChange={v => setForm({ ...form, doctorName: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih dokter" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {doctors.map(d => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name} {d.specialization && `• ${d.specialization}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Jam</Label>
              <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: Appointment['status']) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Catatan</Label>
              <Textarea rows={2} placeholder="Keluhan atau catatan (opsional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit}>{editId ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle>
            <AlertDialogDescription>Jadwal akan dihapus permanen dan tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
