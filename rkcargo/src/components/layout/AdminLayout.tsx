import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, FileText, DollarSign, BarChart3, Truck, LogOut, Menu, X, MessageSquare, Shield, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const links = [
{ label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
{ label: "Parcels", path: "/admin/parcels", icon: Package },
{ label: "Customers", path: "/admin/customers", icon: Users },
{ label: "Invoices", path: "/admin/invoices", icon: FileText },
{ label: "Finance", path: "/admin/finance", icon: DollarSign },
{ label: "Reports", path: "/admin/reports", icon: BarChart3 },
{ label: "Vehicles", path: "/admin/vehicles", icon: Truck },
{ label: "Contacts", path: "/admin/contacts", icon: MessageSquare },
{ label: "Reviews", path: "/admin/reviews", icon: Star },
{ label: "Admin Management", path: "/admin/management", icon: Shield },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
const location = useLocation();
const navigate = useNavigate();
const { signOut } = useAuth();
const [sidebarOpen, setSidebarOpen] = useState(false);

const handleLogout = async () => {
await signOut();
navigate("/admin/login");
};

return ( <div className="min-h-screen bg-gray-50 flex">
  {sidebarOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  )}

  {/* Sidebar */}
  <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
    
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Truck className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="leading-tight">
          <span className="font-display font-bold text-sm">RK Cargo</span>
          <span className="block text-[10px] opacity-60 uppercase">Admin Panel</span>
        </div>
      </div>
    </div>

    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {links.map((l) => {
        const active = location.pathname === l.path;
        return (
          <Link
            key={l.path}
            to={l.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <l.icon className="w-4 h-4" />
            {l.label}
          </Link>
        );
      })}
    </nav>

    <div className="p-3 border-t border-sidebar-border">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  </aside>

  {/* Main content */}
  <div className="flex-1 flex flex-col min-w-0">
    
    {/* Header */}
    <header className="h-14 border-b border-border bg-white flex items-center px-6 gap-3 sticky top-0 z-30">
      <button
        className="lg:hidden p-2 hover:bg-muted rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <h2 className="font-display font-semibold text-sm">
        {links.find((l) => l.path === location.pathname)?.label || "Admin"}
      </h2>

      <div className="ml-auto">
        <Link to="/">
          <Button variant="outline" size="sm">
            View Website
          </Button>
        </Link>
      </div>
    </header>

    {/* ✅ CENTERED CONTENT FIX */}
    <main className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {children}
      </div>
    </main>

  </div>
</div>

);
};

export default AdminLayout;
