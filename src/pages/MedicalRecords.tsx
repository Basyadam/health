import { useState } from 'react';
import { Plus, Search, FileText, Pencil, Trash2, Eye, MoreHorizontal, Calendar, Stethoscope } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMedicalRecords, MedicalRecord } from '@/contexts/MedicalRecordContext';
import { usePatients } from '@/contexts/PatientContext';
import { useUsers } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

const emptyForm = {
  patientId: '',
  doctorName: '',
  visitDate: new Date().toISOString().split('T')[0],
  diagnosis: '',
  treatment: '',
  prescription: '',
  notes: '',
};

export default function MedicalRecords() {
  const { records, addRecord, updateRecord, deleteRecord } = useMedicalRecords();
  const { patients } = usePatients();
  const { users } = useUsers();
  const doctors = users.filter(u => u.role === 'dokter');

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = records.filter(r =>
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.medicalRecordNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (r: MedicalRecord) => {
    setEditId(r.id);
    setForm({
      patientId: r.patientId,
      doctorName: r.doctorName,
      visitDate: r.visitDate,
      diagnosis: r.diagnosis,
      treatment: r.treatment,
      prescription: r.prescription,
      notes: r.notes || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const patient = patients.find(p => p.id === form.patientId);
    if (!patient || !form.doctorName || !form.diagnosis) {
      toast({ title: 'Lengkapi data', description: 'Pasien, dokter, dan diagnosis wajib diisi', variant: 'destructive' });
      return;
    }
    const data = { ...form, patientName: patient.name, medicalRecordNumber: patient.medicalRecordNumber };
    if (editId) {
      updateRecord(editId, data);
      toast({ title: 'Berhasil', description: 'Rekam medis diperbarui' });
    } else {
      addRecord(data);
      toast({ title: 'Berhasil', description: 'Rekam medis ditambahkan' });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteRecord(deleteId);
      toast({ title: 'Berhasil', description: 'Rekam medis dihapus' });
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout>
      <Header title="Rekam Medis" subtitle="Kelola riwayat dan rekam medis pasien" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Cari berdasarkan pasien, No. RM, atau diagnosis..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Rekam Medis
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Tanggal</TableHead>
              <TableHead>No. RM</TableHead>
              <TableHead>Pasien</TableHead>
              <TableHead>Dokter</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Tidak ada rekam medis ditemukan</TableCell>
              </TableRow>
            ) : (
              filtered.map(r => (
                <TableRow key={r.id} className="table-row-hover">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {r.visitDate}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{r.medicalRecordNumber}</TableCell>
                  <TableCell>{r.patientName}</TableCell>
                  <TableCell>{r.doctorName}</TableCell>
                  <TableCell><Badge className="badge-info">{r.diagnosis}</Badge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => setViewRecord(r)}><Eye className="w-4 h-4 mr-2" />Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(r)}><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteId(r.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Rekam Medis' : 'Tambah Rekam Medis'}</DialogTitle>
            <DialogDescription>Lengkapi informasi pemeriksaan pasien</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pasien</Label>
              <Select value={form.patientId} onValueChange={v => setForm({ ...form, patientId: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih pasien" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {patients.map(p => (<SelectItem key={p.id} value={p.id}>{p.name} ({p.medicalRecordNumber})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dokter</Label>
              <Select value={form.doctorName} onValueChange={v => setForm({ ...form, doctorName: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih dokter" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {doctors.map(d => (<SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Tanggal Kunjungan</Label>
              <Input type="date" value={form.visitDate} onChange={e => setForm({ ...form, visitDate: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Diagnosis</Label>
              <Input placeholder="Contoh: Hipertensi Grade 1" value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Tindakan / Perawatan</Label>
              <Textarea rows={2} placeholder="Tindakan yang diberikan" value={form.treatment} onChange={e => setForm({ ...form, treatment: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Resep Obat</Label>
              <Textarea rows={2} placeholder="Contoh: Paracetamol 500mg 3x1" value={form.prescription} onChange={e => setForm({ ...form, prescription: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Catatan</Label>
              <Textarea rows={2} placeholder="Catatan tambahan (opsional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit}>{editId ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />Detail Rekam Medis
            </DialogTitle>
          </DialogHeader>
          {viewRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div><p className="text-xs text-muted-foreground">No. RM</p><p className="font-medium">{viewRecord.medicalRecordNumber}</p></div>
                <div><p className="text-xs text-muted-foreground">Tanggal</p><p className="font-medium">{viewRecord.visitDate}</p></div>
                <div><p className="text-xs text-muted-foreground">Pasien</p><p className="font-medium">{viewRecord.patientName}</p></div>
                <div><p className="text-xs text-muted-foreground">Dokter</p><p className="font-medium flex items-center gap-1"><Stethoscope className="w-4 h-4 text-primary" />{viewRecord.doctorName}</p></div>
              </div>
              <div><p className="text-sm font-semibold mb-1">Diagnosis</p><p className="text-sm bg-card border border-border rounded-lg p-3">{viewRecord.diagnosis}</p></div>
              <div><p className="text-sm font-semibold mb-1">Tindakan / Perawatan</p><p className="text-sm bg-card border border-border rounded-lg p-3 whitespace-pre-wrap">{viewRecord.treatment}</p></div>
              <div><p className="text-sm font-semibold mb-1">Resep Obat</p><p className="text-sm bg-card border border-border rounded-lg p-3 whitespace-pre-wrap">{viewRecord.prescription}</p></div>
              {viewRecord.notes && (<div><p className="text-sm font-semibold mb-1">Catatan</p><p className="text-sm bg-card border border-border rounded-lg p-3 whitespace-pre-wrap">{viewRecord.notes}</p></div>)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Rekam Medis?</AlertDialogTitle>
            <AlertDialogDescription>Data rekam medis akan dihapus permanen dan tidak dapat dikembalikan.</AlertDialogDescription>
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
