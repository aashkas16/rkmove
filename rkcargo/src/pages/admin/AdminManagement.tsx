import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
//import { supabase } from "@/integrations/supabase/client";
//import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Shield, Search, KeyRound } from "lucide-react";
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

  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [showVerify, setShowVerify] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleStartReset = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setVerifyPassword("");
    setNewAdminPassword("");
    setConfirmAdminPassword("");
    setShowVerify(true);
  };

  const handleVerifyPassword = async () => {
    if (!selectedAdmin) return;
    if (!verifyPassword) {
      toast.error("Please enter the current password");
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admins/${selectedAdmin.id}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: verifyPassword })
      });
      if (res.ok) {
        setShowVerify(false);
        setShowReset(true);
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify password");
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedAdmin) return;
    if (!newAdminPassword || !confirmAdminPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (newAdminPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setResetting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admins/${selectedAdmin.id}/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newAdminPassword })
      });
      if (res.ok) {
        toast.success("Password reset successfully!");
        setShowReset(false);
        setSelectedAdmin(null);
      } else {
        toast.error("Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

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
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartReset(admin)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDelete(
                              admin.id,
                              admin.role
                            )
                          }
                          className="text-destructive hover:text-destructive hover:bg-destructive/5"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

      {/* Verify Dialog */}
      <Dialog open={showVerify} onOpenChange={setShowVerify}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Admin Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please enter the current password for admin: <strong>{selectedAdmin?.email}</strong>
            </p>
            <div>
              <label className="text-xs text-muted-foreground">Current Password *</label>
              <Input
                type="password"
                placeholder="Enter current password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowVerify(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleVerifyPassword}
                disabled={verifying}
                className="gradient-accent text-accent-foreground border-0"
              >
                {verifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Dialog */}
      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Set new password for admin: <strong>{selectedAdmin?.email}</strong>
            </p>
            <div>
              <label className="text-xs text-muted-foreground">New Password *</label>
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Confirm New Password *</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmAdminPassword}
                onChange={(e) => setConfirmAdminPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReset(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={resetting}
                className="gradient-accent text-accent-foreground border-0"
              >
                {resetting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
export default AdminManagement;