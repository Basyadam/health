import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PatientProvider } from "@/contexts/PatientContext";
import { MedicalRecordProvider } from "@/contexts/MedicalRecordContext";
import { UserProvider } from "@/contexts/UserContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientNew from "./pages/PatientNew";
import PatientEdit from "./pages/PatientEdit";
import PatientDetail from "./pages/PatientDetail";
import MedicalRecords from "./pages/MedicalRecords";
import Schedule from "./pages/Schedule";
import Users from "./pages/Users";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <PatientProvider>
          <MedicalRecordProvider>
            <AppointmentProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/patients/new" element={<PatientNew />} />
                    <Route path="/patients/:id" element={<PatientDetail />} />
                    <Route path="/patients/:id/edit" element={<PatientEdit />} />
                    <Route path="/records" element={<MedicalRecords />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </AppointmentProvider>
          </MedicalRecordProvider>
        </PatientProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
