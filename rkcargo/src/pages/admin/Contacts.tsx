import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
//import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Mail, MailOpen, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleViewMessage = (sub: ContactSubmission) => {
    setSelectedSubmission(sub);
    setShowViewer(true);
    if (!sub.is_read) {
      toggleRead(sub);
    }
  };

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
                  <TableCell onClick={() => handleViewMessage(sub)} className="max-w-[200px] truncate text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors hover:underline">
                    {sub.message}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleViewMessage(sub)} title="View full message">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
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

      {/* Message Viewer Dialog */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-md w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && new Date(selectedSubmission.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">From Name</span>
                  <span className="font-semibold text-foreground">{selectedSubmission.name}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Phone</span>
                  <span className="text-foreground">{selectedSubmission.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Email Address</span>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">{selectedSubmission.email}</a>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Message Body</span>
                <p className="text-sm text-foreground bg-muted p-4 rounded-xl leading-relaxed whitespace-pre-wrap max-h-[250px] overflow-y-auto">
                  {selectedSubmission.message}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowViewer(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContacts;
