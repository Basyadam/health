import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, MoreHorizontal, Shield, Stethoscope, UserCircle } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsers, SystemUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

const emptyForm = {
  name: '',
  email: '',
  role: 'dokter' as SystemUser['role'],
  specialization: '',
  phone: '',
  status: 'active' as SystemUser['status'],
};

const roleIcon = { admin: Shield, dokter: Stethoscope, perawat: UserCircle };
const roleLabel = { admin: 'Administrator', dokter: 'Dokter', perawat: 'Perawat' };

export default function Users() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    dokter: users.filter(u => u.role === 'dokter').length,
    perawat: users.filter(u => u.role === 'perawat').length,
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (u: SystemUser) => {
    setEditId(u.id);
    setForm({
      name: u.name, email: u.email, role: u.role,
      specialization: u.specialization || '', phone: u.phone, status: u.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) {
      toast({ title: 'Lengkapi data', description: 'Nama, email, dan telepon wajib diisi', variant: 'destructive' });
      return;
    }
    if (editId) {
      updateUser(editId, form);
      toast({ title: 'Berhasil', description: 'Data pengguna diperbarui' });
    } else {
      addUser(form);
      toast({ title: 'Berhasil', description: 'Pengguna ditambahkan' });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteUser(deleteId);
      toast({ title: 'Berhasil', description: 'Pengguna dihapus' });
      setDeleteId(null);
    }
  };

  const getRoleBadge = (role: SystemUser['role']) => {
    const Icon = roleIcon[role];
    const variants = { admin: 'badge-danger', dokter: 'badge-info', perawat: 'badge-success' };
    return (
      <Badge className={variants[role]}>
        <Icon className="w-3 h-3 mr-1" />{roleLabel[role]}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <Header title="Manajemen Pengguna" subtitle="Kelola akun staf rumah sakit" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card"><p className="text-sm text-muted-foreground">Total Pengguna</p><p className="text-2xl font-bold mt-1">{stats.total}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Administrator</p><p className="text-2xl font-bold mt-1 text-destructive">{stats.admin}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Dokter</p><p className="text-2xl font-bold mt-1 text-info">{stats.dokter}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Perawat</p><p className="text-2xl font-bold mt-1 text-success">{stats.perawat}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="dokter">Dokter</SelectItem>
            <SelectItem value="perawat">Perawat</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Tambah Pengguna</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Spesialisasi</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Tidak ada pengguna ditemukan</TableCell></TableRow>
            ) : (
              filtered.map(u => (
                <TableRow key={u.id} className="table-row-hover">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{u.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>{u.specialization || '-'}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>
                    {u.status === 'active' ? <Badge className="badge-success">Aktif</Badge> : <Badge className="badge-warning">Tidak Aktif</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => openEdit(u)}><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteId(u.id)} className="text-destructive focus:text-destructive">
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
            <DialogDescription>Lengkapi data akun staf</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Nama Lengkap</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. Nama Lengkap" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@hospital.com" />
            </div>
            <div className="space-y-2">
              <Label>Telepon</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v: SystemUser['role']) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="dokter">Dokter</SelectItem>
                  <SelectItem value="perawat">Perawat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: SystemUser['status']) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.role === 'dokter' && (
              <div className="space-y-2 md:col-span-2">
                <Label>Spesialisasi</Label>
                <Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Contoh: Penyakit Dalam, Anak, Bedah" />
              </div>
            )}
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
            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>Akun pengguna akan dihapus permanen dan tidak dapat dikembalikan.</AlertDialogDescription>
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
