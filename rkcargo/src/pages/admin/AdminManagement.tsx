import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
//import { supabase } from "@/integrations/supabase/client";
//import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Shield, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL } from "@/config";

interface AdminUser {
  id: number;
  user_id: number;
  role: string;
  created_at: string;
  email?: string;
  full_name?: string;
}

const AdminManagement = () => {
  //const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"super_admin" | "staff">("staff");
  const [adding, setAdding] = useState(false);

const fetchAdmins = async () => {

  try {

    const res = await fetch(
      `${API_BASE_URL}/admins`
    );

    const data = await res.json();

    setAdmins(data || []);

    setLoading(false);

  } catch (err) {

    console.error(err);

    toast.error("Failed to load admins");
  }
};

useEffect(() => {

  fetchAdmins();

}, []);


const handleAddAdmin = async () => {

 if (!newEmail || !newPassword) {

   toast.error(
     "Email and password are required"
   );

   return;
 }

 if (newPassword.length < 6) {

   toast.error(
     "Password must be at least 6 characters"
   );

   return;
 }

 setAdding(true);

 try {

   await fetch(
     `${API_BASE_URL}/admins`,
     {

       method: "POST",

       headers: {
         "Content-Type": "application/json"
       },

       body: JSON.stringify({

         email: newEmail,

         password: newPassword,

         role: newRole
       })
     }
   );

   toast.success(
     "Admin created successfully!"
   );

   setShowAdd(false);

   setNewEmail("");

   setNewPassword("");

   setNewRole("staff");

   fetchAdmins();

 } catch (err) {

   console.error(err);

   toast.error(
     "Failed to create admin"
   );

 } finally {

   setAdding(false);
 }
};

  
const handleDelete = async (
  id: number,
  role: string
) => {

  if (role === "super_admin") {

    toast.error(
      "Super Admin cannot be deleted"
    );

    return;
  }

  if (
    !confirm(
      "Are you sure you want to remove this admin?"
    )
  ) return;

  try {

    await fetch(

      `${API_BASE_URL}/admins/${id}`,

      {
        method: "DELETE"
      }
    );

    toast.success("Admin removed");

    fetchAdmins();

  } catch (err) {

    console.error(err);

    toast.error("Failed to remove admin");
  }
};

  const filtered = admins.filter(
    (a) =>
      (a.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      String(a.user_id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="gradient-accent text-accent-foreground border-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Admin
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No admins found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        {admin.full_name || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          admin.role === "super_admin"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }
                      >
                        {admin.role === "super_admin" ? "Super Admin" : "Staff"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                    {String(admin.user_id).slice(0, 8)}...
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
  handleDelete(
    admin.id,
    admin.role
  )
}
                        className="text-destructive hover:text-destructive"
                        //disabled={admin.user_id === user?.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Email *</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password *</label>
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as "super_admin" | "staff")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddAdmin}
                disabled={adding}
                className="gradient-accent text-accent-foreground border-0"
              >
                {adding ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
export default AdminManagement;