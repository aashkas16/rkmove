import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
//import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/config";

interface Vehicle {
  id: number;
  vehicle_number: string;
  vehicle_type: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editV, setEditV] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({ vehicle_number: "", vehicle_type: "", driver_name: "", driver_phone: "", is_active: true });

  const fetchVehicles = async () => {

  try {

    const res = await fetch(`${API_BASE_URL}/vehicles`);

    const data = await res.json();

    setVehicles(data || []);

    setLoading(false);

  } catch (err) {

    console.error(err);

    toast.error("Failed to load");
  }
};

 useEffect(() => {

  fetchVehicles();

}, []);

  const resetForm = () => setForm({ vehicle_number: "", vehicle_type: "", driver_name: "", driver_phone: "", is_active: true });

  const handleAdd = async () => {

  try {

    await fetch(`${API_BASE_URL}/vehicles`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        vehicle_number: form.vehicle_number,

        vehicle_type: form.vehicle_type || null,

        driver_name: form.driver_name || null,

        driver_phone: form.driver_phone || null,

        is_active: form.is_active
      })
    });

    toast.success("Vehicle added!");

    setShowAdd(false);

    resetForm();

    fetchVehicles();

  } catch (err) {

    console.error(err);

    toast.error("Failed");
  }
};

 const handleUpdate = async () => {

  if (!editV) return;

  try {

    await fetch(`${API_BASE_URL}/vehicles/${editV.id}`, {

      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        vehicle_number: form.vehicle_number,

        vehicle_type: form.vehicle_type || null,

        driver_name: form.driver_name || null,

        driver_phone: form.driver_phone || null,

        is_active: form.is_active
      })
    });

    toast.success("Updated!");

    setEditV(null);

    resetForm();

    fetchVehicles();

  } catch (err) {

    console.error(err);

    toast.error("Failed");
  }
};

  const handleDelete = async (id: number) => {

  if (!confirm("Delete this vehicle?")) return;

  try {

    await fetch(`${API_BASE_URL}/vehicles/${id}`, {

      method: "DELETE"
    });

    toast.success("Deleted");

    fetchVehicles();

  } catch (err) {

    console.error(err);

    toast.error("Failed");
  }
};

  const openEdit = (v: Vehicle) => {
    setForm({ vehicle_number: v.vehicle_number, vehicle_type: v.vehicle_type || "", driver_name: v.driver_name || "", driver_phone: v.driver_phone || "", is_active: v.is_active });
    setEditV(v);
  };

  const filtered = vehicles.filter(v => v.vehicle_number.toLowerCase().includes(search.toLowerCase()) || (v.driver_name || "").toLowerCase().includes(search.toLowerCase()));

  const formUI = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className="text-xs text-muted-foreground">Vehicle Number *</label><Input value={form.vehicle_number} onChange={e => setForm({...form, vehicle_number: e.target.value})} /></div>
      <div><label className="text-xs text-muted-foreground">Type</label><Input value={form.vehicle_type} onChange={e => setForm({...form, vehicle_type: e.target.value})} placeholder="e.g. Truck, Tempo" /></div>
      <div><label className="text-xs text-muted-foreground">Driver Name</label><Input value={form.driver_name} onChange={e => setForm({...form, driver_name: e.target.value})} /></div>
      <div><label className="text-xs text-muted-foreground">Driver Phone</label><Input value={form.driver_phone} onChange={e => setForm({...form, driver_phone: e.target.value})} /></div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search vehicle, driver..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Button onClick={() => { resetForm(); setShowAdd(true); }} className="gradient-accent text-accent-foreground border-0"><Plus className="w-4 h-4 mr-1" /> Add Vehicle</Button>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Vehicle No.</TableHead><TableHead>Type</TableHead><TableHead>Driver</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No vehicles</TableCell></TableRow>
              ) : filtered.map(v => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono font-medium">{v.vehicle_number}</TableCell>
                  <TableCell>{v.vehicle_type || "-"}</TableCell>
                  <TableCell>{v.driver_name || "-"}</TableCell>
                  <TableCell>{v.driver_phone || "-"}</TableCell>
                  <TableCell><Badge className={v.is_active ? "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,35%)]" : "bg-destructive/10 text-destructive"}>{v.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent><DialogHeader><DialogTitle>Add Vehicle</DialogTitle></DialogHeader>{formUI}
          <div className="flex justify-end gap-2 mt-4"><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={handleAdd} className="gradient-accent text-accent-foreground border-0">Add</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editV} onOpenChange={() => setEditV(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Vehicle</DialogTitle></DialogHeader>{formUI}
          <div className="flex justify-end gap-2 mt-4"><Button variant="outline" onClick={() => setEditV(null)}>Cancel</Button><Button onClick={handleUpdate} className="gradient-accent text-accent-foreground border-0">Update</Button></div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminVehicles;
