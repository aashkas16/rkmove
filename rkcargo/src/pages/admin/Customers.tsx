import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/config";

interface Customer {
id: number;
name: string;
phone: string;
email: string | null;
address: string | null;
created_at: string;
}

const categories = ["Corporate", "Regular", "VIP", "Vendor", "Transport Partner"];

const catColor: Record<string, string> = {
Corporate: "bg-primary/10 text-primary",
Regular: "bg-muted text-muted-foreground",
VIP: "bg-accent/10 text-accent",
Vendor: "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,35%)]",
"Transport Partner": "bg-primary/10 text-primary",
};

const AdminCustomers = () => {
const [customers, setCustomers] = useState<Customer[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [showAdd, setShowAdd] = useState(false);
const [editCust, setEditCust] = useState<Customer | null>(null);
const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", category: "Regular", notes: "" });

// ✅ FETCH CUSTOMERS (REPLACED)
const fetchCustomers = async () => {
try {
const res = await fetch(`${API_BASE_URL}/customers`);
const data = await res.json();
setCustomers(data || []);
setLoading(false);
} catch (err) {
console.error(err);
toast.error("Failed to load customers");
}
};

useEffect(() => { fetchCustomers(); }, []);

const resetForm = () => setForm({ name: "", phone: "", email: "", address: "", category: "Regular", notes: "" });

// ✅ ADD CUSTOMER (REPLACED)
const handleAdd = async () => {
try {
await fetch(`${API_BASE_URL}/customers`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
name: form.name,
phone: form.phone,
email: form.email,
address: form.address
})
});

  toast.success("Customer added!");
  setShowAdd(false);
  resetForm();
  fetchCustomers();
} catch (err) {
  console.error(err);
  toast.error("Failed to add customer");
}


};



// ❌ TEMP: NOT CONNECTED YET
const handleUpdate = async () => {
  try {
    await fetch(`${API_BASE_URL}/customers/${editCust.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address
      })
    });

    toast.success("Customer updated");
    setEditCust(null);
    resetForm();
    fetchCustomers();

  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
};

const handleDelete = async (id: number) => {
  try {
    await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE"
    });

    toast.success("Customer deleted");
    fetchCustomers();

  } catch (err) {
    console.error(err);
    toast.error("Delete failed");
  }
};

const openEdit = (c: Customer) => {
setForm({
name: c.name,
phone: c.phone,
email: c.email || "",
address: c.address || "",
category: "Regular",
notes: ""
});
setEditCust(c);
};

const filtered = customers.filter(c =>
c.name.toLowerCase().includes(search.toLowerCase()) ||
c.phone.includes(search) ||
(c.email && c.email.toLowerCase().includes(search.toLowerCase()))
);

const formUI = ( <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div><label className="text-xs">Name *</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div> <div><label className="text-xs">Phone *</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div> <div><label className="text-xs">Email</label><Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div> <div><label className="text-xs">Address</label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div> </div>
);

return (
  <AdminLayout>
    <div className="max-w-[1100px] mx-auto space-y-6">

      {/* SEARCH + BUTTON */}
      <div className="flex items-center justify-between gap-4">
        <Input
          className="max-w-md"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          onClick={() => { resetForm(); setShowAdd(true); }}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Customer
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ADD DIALOG */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          {formUI}
          <Button onClick={handleAdd}>Add</Button>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={!!editCust} onOpenChange={() => setEditCust(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>

          {formUI}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditCust(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  </AdminLayout>
);
};

export default AdminCustomers;