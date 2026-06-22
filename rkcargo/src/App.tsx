import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Tracking from "./pages/Tracking";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminParcels from "./pages/admin/Parcels";
import AdminCustomers from "./pages/admin/Customers";
import AdminInvoices from "./pages/admin/Invoices";
import AdminFinance from "./pages/admin/Finance";
import AdminReports from "./pages/admin/Reports";
import AdminVehicles from "./pages/admin/Vehicles";
import AdminContacts from "./pages/admin/Contacts";
import AdminManagement from "./pages/admin/AdminManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/parcels" element={<ProtectedRoute><AdminParcels /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
            <Route path="/admin/invoices" element={<AdminInvoices />} />
            <Route path="/admin/finance" element={<ProtectedRoute><AdminFinance /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/vehicles" element={<ProtectedRoute><AdminVehicles /></ProtectedRoute>} />
            <Route path="/admin/contacts" element={<ProtectedRoute><AdminContacts /></ProtectedRoute>} />
            <Route path="/admin/management" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;