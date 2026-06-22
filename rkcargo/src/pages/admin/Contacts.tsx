import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
//import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Mail, MailOpen, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_BASE_URL } from "@/config";

interface ContactSubmission {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminContacts = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

 const fetchSubmissions = async () => {

  try {

    const res = await fetch(`${API_BASE_URL}/contact-submissions`);

    const data = await res.json();

    setSubmissions(data || []);

    setLoading(false);

  } catch (err) {

    console.error(err);

    toast.error("Failed to load submissions");
  }
};

  useEffect(() => { fetchSubmissions(); }, []);

  const toggleRead = async (sub: ContactSubmission) => {

  try {

    await fetch(

      `${API_BASE_URL}/contact-submissions/${sub.id}`,

      {

        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          is_read: !sub.is_read
        })
      }
    );

    fetchSubmissions();

  } catch (err) {

    console.error(err);

    toast.error("Failed to update");
  }
};

  const handleDelete = async (id: number) => {

  try {

    await fetch(

      `${API_BASE_URL}/contact-submissions/${id}`,

      {
        method: "DELETE"
      }
    );

    toast.success("Deleted");

    fetchSubmissions();

  } catch (err) {

    console.error(err);

    toast.error("Failed to delete");
  }
};

  const filtered = submissions.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const unreadCount = submissions.filter(s => !s.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">{unreadCount} unread</Badge>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No contact submissions yet</TableCell></TableRow>
              ) : filtered.map(sub => (
                <TableRow key={sub.id} className={!sub.is_read ? "bg-primary/5" : ""}>
                  <TableCell>
                    <Badge className={sub.is_read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}>
                      {sub.is_read ? "Read" : "New"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>{sub.phone}</TableCell>
                  <TableCell className="text-sm">{sub.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{sub.message}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleRead(sub)} title={sub.is_read ? "Mark unread" : "Mark read"}>
                      {sub.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
