import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePatients, Patient } from '@/contexts/PatientContext';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  medicalRecordNumber: z.string().min(1, 'No. RM wajib diisi'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  birthDate: z.string().min(1, 'Tanggal lahir wajib diisi'),
  gender: z.enum(['Laki-laki', 'Perempuan']),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  status: z.enum(['active', 'inactive', 'critical']),
});

type FormData = z.infer<typeof formSchema>;

interface PatientFormProps {
  patient?: Patient;
  mode: 'create' | 'edit';
}

export function PatientForm({ patient, mode }: PatientFormProps) {
  const navigate = useNavigate();
  const { addPatient, updatePatient } = usePatients();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalRecordNumber: patient?.medicalRecordNumber || `RM-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      name: patient?.name || '',
      birthDate: patient?.birthDate || '',
      gender: patient?.gender || 'Laki-laki',
      address: patient?.address || '',
      phone: patient?.phone || '',
      status: patient?.status || 'active',
    },
  });

  const onSubmit = (data: FormData) => {
    const patientData = {
      medicalRecordNumber: data.medicalRecordNumber,
      name: data.name,
      birthDate: data.birthDate,
      gender: data.gender,
      address: data.address,
      phone: data.phone,
      status: data.status,
    };
    
    if (mode === 'create') {
      addPatient(patientData);
      toast({
        title: 'Berhasil',
        description: 'Data pasien berhasil ditambahkan',
      });
    } else if (patient) {
      updatePatient(patient.id, patientData);
      toast({
        title: 'Berhasil',
        description: 'Data pasien berhasil diperbarui',
      });
    }
    navigate('/patients');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="medicalRecordNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. Rekam Medis</FormLabel>
                <FormControl>
                  <Input {...field} disabled={mode === 'edit'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="08xxxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover">
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    <SelectItem value="critical">Kritis</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Masukkan alamat lengkap"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit">
            {mode === 'create' ? 'Tambah Pasien' : 'Simpan Perubahan'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/patients')}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
