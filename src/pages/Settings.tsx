import { useState } from 'react';
import { Building2, User, Bell, Lock, Palette, Save } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuth();

  const [hospital, setHospital] = useState({
    name: 'MediCare Hospital',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '021-12345678',
    email: 'info@medicare.com',
    website: 'www.medicare.com',
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '08123456789',
  });

  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  const [notifications, setNotifications] = useState({
    emailAppointment: true, emailPatient: true, emailReport: false,
    pushAppointment: true, pushCritical: true, pushSystem: false,
  });

  const [appearance, setAppearance] = useState({
    darkMode: false, compactMode: false, language: 'id',
  });

  const handleSave = (section: string) => {
    toast({ title: 'Berhasil', description: `Pengaturan ${section} disimpan` });
  };

  const handlePasswordChange = () => {
    if (!password.current || !password.new || !password.confirm) {
      toast({ title: 'Lengkapi data', description: 'Semua field password wajib diisi', variant: 'destructive' });
      return;
    }
    if (password.new !== password.confirm) {
      toast({ title: 'Password tidak cocok', description: 'Konfirmasi password tidak sama', variant: 'destructive' });
      return;
    }
    toast({ title: 'Berhasil', description: 'Password berhasil diubah' });
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <DashboardLayout>
      <Header title="Pengaturan" subtitle="Kelola pengaturan sistem dan akun" />

      <Tabs defaultValue="hospital" className="animate-fade-in">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 mb-6 h-auto">
          <TabsTrigger value="hospital" className="gap-2 py-2.5"><Building2 className="w-4 h-4" /><span className="hidden sm:inline">Rumah Sakit</span></TabsTrigger>
          <TabsTrigger value="profile" className="gap-2 py-2.5"><User className="w-4 h-4" /><span className="hidden sm:inline">Profil</span></TabsTrigger>
          <TabsTrigger value="security" className="gap-2 py-2.5"><Lock className="w-4 h-4" /><span className="hidden sm:inline">Keamanan</span></TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 py-2.5"><Bell className="w-4 h-4" /><span className="hidden sm:inline">Notifikasi</span></TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 py-2.5"><Palette className="w-4 h-4" /><span className="hidden sm:inline">Tampilan</span></TabsTrigger>
        </TabsList>

        <TabsContent value="hospital">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Informasi Rumah Sakit</h3>
              <p className="text-sm text-muted-foreground">Kelola data informasi rumah sakit</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2"><Label>Nama Rumah Sakit</Label><Input value={hospital.name} onChange={e => setHospital({ ...hospital, name: e.target.value })} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Alamat</Label><Textarea rows={2} value={hospital.address} onChange={e => setHospital({ ...hospital, address: e.target.value })} /></div>
              <div className="space-y-2"><Label>Telepon</Label><Input value={hospital.phone} onChange={e => setHospital({ ...hospital, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={hospital.email} onChange={e => setHospital({ ...hospital, email: e.target.value })} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Website</Label><Input value={hospital.website} onChange={e => setHospital({ ...hospital, website: e.target.value })} /></div>
            </div>
            <Separator className="my-6" />
            <Button onClick={() => handleSave('rumah sakit')}><Save className="w-4 h-4 mr-2" />Simpan Perubahan</Button>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Profil Saya</h3>
              <p className="text-sm text-muted-foreground">Kelola informasi akun pribadi Anda</p>
            </div>
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">{profile.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold">{profile.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Lengkap</Label><Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Nomor Telepon</Label><Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></div>
            </div>
            <Separator className="my-6" />
            <Button onClick={() => handleSave('profil')}><Save className="w-4 h-4 mr-2" />Simpan Profil</Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Ubah Password</h3>
              <p className="text-sm text-muted-foreground">Pastikan menggunakan password yang kuat dan aman</p>
            </div>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2"><Label>Password Saat Ini</Label><Input type="password" value={password.current} onChange={e => setPassword({ ...password, current: e.target.value })} /></div>
              <div className="space-y-2"><Label>Password Baru</Label><Input type="password" value={password.new} onChange={e => setPassword({ ...password, new: e.target.value })} /></div>
              <div className="space-y-2"><Label>Konfirmasi Password Baru</Label><Input type="password" value={password.confirm} onChange={e => setPassword({ ...password, confirm: e.target.value })} /></div>
            </div>
            <Separator className="my-6" />
            <Button onClick={handlePasswordChange}><Lock className="w-4 h-4 mr-2" />Ubah Password</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Preferensi Notifikasi</h3>
              <p className="text-sm text-muted-foreground">Pilih notifikasi yang ingin Anda terima</p>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Notifikasi Email</h4>
                <div className="space-y-3">
                  {[
                    { key: 'emailAppointment', label: 'Jadwal kunjungan baru', desc: 'Email saat ada appointment baru' },
                    { key: 'emailPatient', label: 'Pasien baru terdaftar', desc: 'Email saat pasien baru ditambahkan' },
                    { key: 'emailReport', label: 'Laporan mingguan', desc: 'Ringkasan mingguan via email' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={v => setNotifications({ ...notifications, [item.key]: v })} />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-3">Notifikasi Push</h4>
                <div className="space-y-3">
                  {[
                    { key: 'pushAppointment', label: 'Pengingat jadwal', desc: 'Notifikasi pengingat appointment' },
                    { key: 'pushCritical', label: 'Pasien kritis', desc: 'Alert untuk pasien dalam kondisi kritis' },
                    { key: 'pushSystem', label: 'Update sistem', desc: 'Notifikasi pembaruan sistem' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={v => setNotifications({ ...notifications, [item.key]: v })} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <Button onClick={() => handleSave('notifikasi')}><Save className="w-4 h-4 mr-2" />Simpan Preferensi</Button>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Tampilan</h3>
              <p className="text-sm text-muted-foreground">Sesuaikan tampilan aplikasi</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Mode Gelap</p>
                  <p className="text-sm text-muted-foreground">Aktifkan tema gelap untuk mata yang lebih nyaman</p>
                </div>
                <Switch checked={appearance.darkMode} onCheckedChange={v => {
                  setAppearance({ ...appearance, darkMode: v });
                  document.documentElement.classList.toggle('dark', v);
                }} />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Mode Kompak</p>
                  <p className="text-sm text-muted-foreground">Tampilan lebih padat untuk produktivitas</p>
                </div>
                <Switch checked={appearance.compactMode} onCheckedChange={v => setAppearance({ ...appearance, compactMode: v })} />
              </div>
              <Separator />
              <div className="py-3">
                <p className="font-medium mb-3">Bahasa</p>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button onClick={() => setAppearance({ ...appearance, language: 'id' })} className={`p-3 rounded-lg border-2 text-left transition-colors ${appearance.language === 'id' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <p className="font-medium">🇮🇩 Indonesia</p>
                    <p className="text-xs text-muted-foreground">Bahasa Indonesia</p>
                  </button>
                  <button onClick={() => setAppearance({ ...appearance, language: 'en' })} className={`p-3 rounded-lg border-2 text-left transition-colors ${appearance.language === 'en' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <p className="font-medium">🇬🇧 English</p>
                    <p className="text-xs text-muted-foreground">English Language</p>
                  </button>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <Button onClick={() => handleSave('tampilan')}><Save className="w-4 h-4 mr-2" />Simpan Pengaturan</Button>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
