import { useEffect, useState } from "react";
import { Eye, Edit2, Trash2, Printer } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const AdminNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewNotice, setViewNotice] = useState<Notice | null>(null);
  const [editNotice, setEditNotice] = useState<Notice | null>(null);
  
  const [newForm, setNewForm] = useState({
    title: "",
    content: ""
  });

  const [editForm, setEditForm] = useState({
    title: "",
    content: ""
  });

  // Local storage fallback helper
  const getLocalNotices = (): Notice[] => {
    const data = localStorage.getItem("rk_notices");
    if (!data) {
      const defaultNotices: Notice[] = [
        {
          id: 1,
          title: "Ahmedabad Shifting Branch Guidelines",
          content: "This is to inform all personnel that high-bubble wrapping and multi-layer carton crates are mandatory for glassware and electronics consignments dispatched from Ahmedabad Office G-12. Please print and retain this instruction sheet.",
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem("rk_notices", JSON.stringify(defaultNotices));
      return defaultNotices;
    }
    return JSON.parse(data);
  };

  const saveLocalNotice = (notice: Omit<Notice, "id" | "created_at">) => {
    const list = getLocalNotices();
    const newItem: Notice = {
      id: Date.now(),
      title: notice.title,
      content: notice.content,
      created_at: new Date().toISOString()
    };
    list.unshift(newItem);
    localStorage.setItem("rk_notices", JSON.stringify(list));
    return newItem;
  };

  const deleteLocalNotice = (id: number) => {
    const list = getLocalNotices();
    const filtered = list.filter(n => n.id !== id);
    localStorage.setItem("rk_notices", JSON.stringify(filtered));
  };

  const updateLocalNotice = (id: number, notice: Partial<Notice>) => {
    const list = getLocalNotices();
    const index = list.findIndex(n => n.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...notice };
      localStorage.setItem("rk_notices", JSON.stringify(list));
    }
  };

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/notices`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      setNotices(data || []);
    } catch (err) {
      console.warn("Backend fetch failed, using localStorage:", err);
      setNotices(getLocalNotices());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdd = async () => {
    if (!newForm.title || !newForm.content) {
      toast.error("Please fill out all required fields.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/notices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm)
      });
      if (!res.ok) throw new Error("API failed");
      toast.success("Document registered successfully!");
      setNewForm({ title: "", content: "" });
      fetchNotices();
    } catch (err) {
      console.warn("Backend post failed, writing to localStorage:", err);
      saveLocalNotice(newForm);
      toast.success("Document registered to local storage!");
      setNewForm({ title: "", content: "" });
      fetchNotices();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notices/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("API failed");
      toast.success("Document deleted.");
      fetchNotices();
    } catch (err) {
      console.warn("Backend delete failed, editing localStorage:", err);
      deleteLocalNotice(id);
      toast.success("Document deleted from local storage.");
      fetchNotices();
    }
  };

  const handleEditSave = async () => {
    if (!editNotice) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notices/${editNotice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error("API failed");
      toast.success("Document updated.");
      setEditNotice(null);
      fetchNotices();
    } catch (err) {
      console.warn("Backend update failed, editing localStorage:", err);
      updateLocalNotice(editNotice.id, editForm);
      toast.success("Document updated locally.");
      setEditNotice(null);
      fetchNotices();
    }
  };

  const handlePrint = (notice: Notice) => {
    const w = window.open('', '_blank');
    if (!w) {
      toast.error("Please allow popups to print.");
      return;
    }
    const origin = window.location.origin;
    const htmlContent = `
      <html>
        <head>
          <title>${notice.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 0;
              color: #1e293b;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .letterhead-container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
              padding: 40px 40px 20px 40px;
              position: relative;
            }
            .header-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 4px solid #1e3a8a;
              padding-bottom: 20px;
            }
            .logo-box {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo-img {
              width: 90px;
              height: auto;
            }
            .brand-box {
              text-align: right;
            }
            .brand-name {
              font-size: 32px;
              font-weight: 900;
              color: #1e3a8a;
              margin: 0;
              letter-spacing: 0.5px;
            }
            .brand-name span {
              color: #ea580c;
            }
            .brand-subtitle {
              font-size: 14px;
              font-weight: 700;
              color: #1e3a8a;
              margin: 2px 0 8px 0;
              letter-spacing: 2px;
              border-top: 1px solid #cbd5e1;
              padding-top: 4px;
            }
            .address-box {
              font-size: 10px;
              color: #64748b;
              max-width: 320px;
              line-height: 1.4;
              display: inline-flex;
              align-items: flex-start;
              gap: 4px;
            }
            .content-section {
              flex-grow: 1;
              margin-top: 40px;
              margin-bottom: 120px;
              line-height: 1.6;
              font-size: 14px;
              white-space: pre-wrap;
              color: #334155;
            }
            .notice-title {
              font-size: 18px;
              font-weight: 800;
              text-align: center;
              text-decoration: underline;
              margin-bottom: 30px;
              color: #0f172a;
              text-transform: uppercase;
            }
            .stamp-sig-section {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              margin-top: 30px;
              page-break-inside: avoid;
            }
            .sig-label {
              font-size: 12px;
              font-weight: 700;
              color: #1e3a8a;
            }
            .stamp-img {
              width: 100px;
              height: 100px;
              margin-top: 6px;
              object-fit: contain;
            }
            .footer-section {
              border-top: 2px solid #ea580c;
              padding-top: 16px;
              margin-top: 20px;
              page-break-inside: avoid;
            }
            .footer-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              text-align: center;
              margin-bottom: 14px;
            }
            .footer-col {
              border-right: 1px solid #e2e8f0;
              padding: 0 4px;
            }
            .footer-col:last-child {
              border-right: none;
            }
            .footer-col-lbl {
              font-size: 9px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .footer-col-val {
              font-size: 10px;
              font-weight: 800;
              color: #1e3a8a;
            }
            .footer-decor {
              display: flex;
              height: 16px;
              width: 100%;
              border-radius: 4px;
              overflow: hidden;
            }
            .decor-blue {
              background: #1e3a8a;
              width: 60%;
            }
            .decor-orange {
              background: #ea580c;
              width: 40%;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .letterhead-container {
                padding: 30px 30px 10px 30px;
                min-height: 100vh;
                height: 100vh;
              }
            }
          </style>
        </head>
        <body>
          <div class="letterhead-container">
            <div>
              <div class="header-section">
                <div class="logo-box">
                  <img src="${origin}/images/rk-logo.png" class="logo-img" alt="Logo" />
                </div>
                <div class="brand-box">
                  <h1 class="brand-name">R.K.<span>CARGO</span></h1>
                  <div class="brand-subtitle">PACKERS AND MOVERS</div>
                  <div class="address-box">
                    <span style="font-weight: 800; font-size: 12px; color: #1e3a8a; margin-right: 2px;">📍</span>
                    <span>Office No G-12, Lavkush Complex, Opp Green Villa, D-Cabin, Sabarmati, Ahmedabad - 380019</span>
                  </div>
                </div>
              </div>
              
              <div class="content-section">
                <div class="notice-title">${notice.title}</div>
                <div>${notice.content}</div>
              </div>
            </div>
            
            <div>
              <div class="stamp-sig-section">
                <div class="sig-label">For, R.K. CARGO PACKERS & MOVERS</div>
                <img src="${origin}/images/stamp.png" class="stamp-img" alt="Stamp" />
              </div>
              
              <div class="footer-section">
                <div class="footer-grid">
                  <div class="footer-col">
                    <div class="footer-col-lbl">GST No.</div>
                    <div class="footer-col-val">24ARXPP9693E1ZV</div>
                  </div>
                  <div class="footer-col">
                    <div class="footer-col-lbl">Website</div>
                    <div class="footer-col-val">www.rkcargopackersandmovers.com</div>
                  </div>
                  <div class="footer-col">
                    <div class="footer-col-lbl">Mobile No.</div>
                    <div class="footer-col-val">9727807476</div>
                  </div>
                  <div class="footer-col">
                    <div class="footer-col-lbl">Proprietor Name</div>
                    <div class="footer-col-val">Pradeep Swami</div>
                  </div>
                </div>
                <div class="footer-decor">
                  <div class="decor-blue"></div>
                  <div class="decor-orange"></div>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
    w.document.open();
    w.document.write(htmlContent);
    w.document.close();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Ahmedabad Branch Notice & Letterhead</h1>
          <p className="text-gray-500 text-sm mt-1">Draft notices and print them directly on R.K. Cargo branch letterhead templates.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Draft Document</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Title / Subject *</label>
                <Input
                  placeholder="e.g. OFFICE GUIDELINES"
                  value={newForm.title}
                  onChange={(e) => setNewForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Body Text Content *</label>
                <Textarea
                  rows={10}
                  placeholder="Enter notice text here. Double-spaces and newlines are preserved."
                  value={newForm.content}
                  onChange={(e) => setNewForm(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <Button onClick={handleAdd} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Save & Register Document
              </Button>
            </div>
          </div>

          {/* List */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm min-h-[400px]">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Saved Notices</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-400 py-8">
                        No notice documents registered yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    notices.map((n) => (
                      <TableRow key={n.id}>
                        <TableCell className="font-medium text-gray-900">{n.title}</TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {new Date(n.created_at).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button onClick={() => setViewNotice(n)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                            View / Print
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditNotice(n);
                              setEditForm({ title: n.title, content: n.content });
                            }}
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(n.id)}
                            className="text-red-500 hover:text-red-600"
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
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editNotice} onOpenChange={() => setEditNotice(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Ahmedabad Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Title / Subject *</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Body Text Content *</label>
              <Textarea
                rows={8}
                value={editForm.content}
                onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditNotice(null)}>Cancel</Button>
              <Button onClick={handleEditSave} className="bg-orange-600 hover:bg-orange-700 text-white">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewNotice} onOpenChange={() => setViewNotice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 bg-gray-50 border-b flex flex-row items-center justify-between">
            <DialogTitle className="text-sm font-semibold">Simulated Letterhead Preview</DialogTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => viewNotice && handlePrint(viewNotice)} className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                <Printer className="w-3.5 h-3.5 mr-1" /> Print
              </Button>
              <Button size="sm" variant="outline" onClick={() => setViewNotice(null)} className="text-xs">
                Close
              </Button>
            </div>
          </DialogHeader>
          
          {viewNotice && (
            <div className="p-8 bg-white min-h-[600px] flex flex-col justify-between font-sans border-t border-gray-100">
              {/* Header */}
              <div>
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start border-b-4 border-blue-900 pb-5 gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/images/rk-logo.png" className="w-20 h-auto" alt="Logo" />
                  </div>
                  <div className="text-center md:text-right">
                    <h1 className="text-2xl font-extrabold text-blue-900 leading-none">
                      R.K.<span className="text-orange-600">CARGO</span>
                    </h1>
                    <div className="text-[10px] font-bold text-blue-900 tracking-widest mt-1 border-t border-gray-200 pt-1">
                      PACKERS AND MOVERS
                    </div>
                    <div className="text-[9px] text-gray-500 max-w-[280px] leading-relaxed mt-1 mx-auto md:ml-auto">
                      📍 Office No G-12, Lavkush Complex, Opp Green Villa, D-Cabin, Sabarmati, Ahmedabad - 380019
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8 mb-16 text-sm leading-relaxed">
                  <div className="text-base font-extrabold text-center underline mb-6 text-gray-900 uppercase">
                    {viewNotice.title}
                  </div>
                  <div className="whitespace-pre-wrap text-gray-700">
                    {viewNotice.content}
                  </div>
                </div>
              </div>

              {/* Bottom Stamp & Footer */}
              <div>
                <div className="flex flex-col items-end pr-4 mb-6">
                  <div className="text-[11px] font-bold text-blue-900">For, R.K. CARGO PACKERS & MOVERS</div>
                  <img src="/images/stamp.png" className="w-20 h-20 mt-1 object-contain" alt="Stamp" />
                </div>

                <div className="border-t border-orange-600 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-3">
                    <div className="border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0">
                      <div className="text-[8px] font-bold text-gray-400 uppercase">GST No.</div>
                      <div className="text-[10px] font-extrabold text-blue-900">24ARXPP9693E1ZV</div>
                    </div>
                    <div className="border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0">
                      <div className="text-[8px] font-bold text-gray-400 uppercase">Website</div>
                      <div className="text-[9px] font-extrabold text-blue-900 break-all">www.rkcargopackersandmovers.com</div>
                    </div>
                    <div className="border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0">
                      <div className="text-[8px] font-bold text-gray-400 uppercase">Mobile No.</div>
                      <div className="text-[10px] font-extrabold text-blue-900">9727807476</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase">Proprietor Name</div>
                      <div className="text-[10px] font-extrabold text-blue-900">Pradeep Swami</div>
                    </div>
                  </div>
                  
                  {/* Stripes */}
                  <div className="flex h-3.5 rounded overflow-hidden">
                    <div className="bg-blue-900 w-[60%]"></div>
                    <div className="bg-orange-600 w-[40%]"></div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNotices;
