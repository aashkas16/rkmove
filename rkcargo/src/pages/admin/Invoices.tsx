import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search, Eye, Printer, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { printDocument } from "@/utils/documentTemplates";
import { API_BASE_URL } from "@/config";

const DOC_TYPES = ["LR Copy", "Quotation", "Money Receipt", "Bill", "Packing List"] as const;
type DocType = typeof DOC_TYPES[number];

interface Invoice {
  id: number;
  invoice_number: string;
  invoice_type: string;
  customer_name: string;
  customer_phone: string | null;
  customer_address: string | null;
  lr_number: string | null;
  items: any;
  subtotal: number;
  gst_percent: number;
  gst_amount: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
}

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [viewInv, setViewInv] = useState<Invoice | null>(null);
  const [docType, setDocType] = useState<DocType>("Bill");

  // Form state
  const [form, setForm] = useState<any>({});

  const resetForm = (type: DocType) => {
    setDocType(type);
    const base = { customer_name: "", customer_phone: "", customer_address: "", lr_number: "", gst_percent: "", notes: "" };
    switch (type) {
      case "LR Copy":
        setForm({ ...base, consignee_name: "", consignee_address: "", from_location: "", to_location: "", payment_type: "Paid", items: [{ description: "", packages: "", weight_actual: "", weight_charged: "", rate: 0, freight: 0 }] });
        break;
      case "Quotation":
        setForm({ ...base, from_location: "", to_location: "", moment_date: "", notes_amount: "",
          particulars: [
            { label: 'i) Packing Charges - (with men and material)', amount: '' },
            { label: 'Transportation charges for households (Door to Door / GODn To Gdn)', amount: '' },
            { label: 'Loading Charges', floor: '', amount: '' },
            { label: 'Unloading charges', floor: '', amount: '' },
            { label: 'Escort with vehicle, his expenses & return fare', amount: '' },
            { label: 'Unpacking Charges & Rearranging', amount: '' },
            { label: 'Car transportation inclusive of loading & unloading (Insurance by Party)', amount: '' },
            { label: 'Octroi Charges / Entry Tax if Applicable', amount: '' },
            { label: 'Transit Insurance Premium (Only for accidental risk) of the declarde goods value', amount: '' },
            { label: 'Or Carrier risk charge (all risk) of the declared goods value', amount: '' },
            { label: 'Storage Charges (per day)', amount: '' },
          ]
        });
        break;
      case "Money Receipt":
        setForm({ ...base, amount_words: "", payment_ref: "", payment_date: "", against_bill: "", against_date: "", amount: 0 });
        break;
      case "Bill":
        setForm({ ...base, from_location: "", to_location: "", vehicle_number: "", vehicle_type: "4 Wheeler", HSN_code: "9965", weight: "", rate: "", 
          particulars: [
            { label: 'Freight', amount: '' },
            { label: 'Loading charges', amount: '' },
            { label: 'Unloding charges', amount: '' },
            { label: 'Packing charges', amount: '' },
            { label: 'Ins.', amount: '' },
          ]
        });
        break;
      case "Packing List":
        setForm({ ...base, from_location: "", to_location: "", articles: [{ no: 1, description: "" }] });
        break;
      default:
        setForm({ ...base, from_location: "", to_location: "", vehicle_number: "", items: [{ particulars: "", rate: 0, weight: "", amount: 0 }] });
        break;
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/invoices`);
      const data = await res.json();
      setInvoices(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoices");
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const calcTotals = () => {
    if (docType === "Money Receipt") return { subtotal: form.amount || 0, gstAmt: 0, total: form.amount || 0 };
    const gstRate = parseFloat(form.gst_percent);
    const hasGst = !isNaN(gstRate) && gstRate > 0;
    if (docType === "Quotation" || docType === "Bill") {
      const sub = (form.particulars || []).reduce((s: number, p: any) => s + (parseFloat(p.amount) || 0), 0);
      const gst = hasGst ? sub * gstRate / 100 : 0;
      return { subtotal: sub, gstAmt: gst, total: sub + gst };
    }
    const items = form.items || [];
    const sub = items.reduce((s: number, i: any) => s + (parseFloat(i.amount) || parseFloat(i.freight) || 0), 0);
    const gst = hasGst ? sub * gstRate / 100 : 0;
    return { subtotal: sub, gstAmt: gst, total: sub + gst };
  };

  const handleCreate = async () => {
    if (!form.customer_name) { toast.error("Customer name is required"); return; }
    const { subtotal, gstAmt, total } = calcTotals();

    const meta: any = { doc_type: docType };
    let lineItems: any[] = [];

    if (docType === "LR Copy") {
      meta.consignee_name = form.consignee_name;
      meta.consignee_address = form.consignee_address;
      meta.from_location = form.from_location;
      meta.to_location = form.to_location;
      meta.payment_type = form.payment_type;
      lineItems = form.items || [];
    } else if (docType === "Quotation") {
      meta.from_location = form.from_location;
      meta.to_location = form.to_location;
      meta.moment_date = form.moment_date || '';
      lineItems = form.particulars || [];
    } else if (docType === "Packing List") {
      meta.from_location = form.from_location;
      meta.to_location = form.to_location;
      lineItems = form.articles || [];
    } else if (docType === "Money Receipt") {
      meta.amount_words = form.amount_words;
      meta.payment_ref = form.payment_ref;
      meta.payment_date = form.payment_date;
      meta.against_bill = form.against_bill;
      meta.against_date = form.against_date;
    } else if (docType === "Bill") {
      meta.from_location = form.from_location;
      meta.to_location = form.to_location;
      meta.vehicle_number = form.vehicle_number;
      meta.vehicle_type = form.vehicle_type || '4 Wheeler';
      meta.HSN_code = form.HSN_code || '9965';
      meta.weight = form.weight || '';
      meta.rate = form.rate || '';
      lineItems = form.particulars || [];
    } else {
      meta.from_location = form.from_location;
      meta.to_location = form.to_location;
      meta.vehicle_number = form.vehicle_number;
      lineItems = form.items || [];
    }

    try {
      const res = await fetch(`${API_BASE_URL}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          invoice_type: docType,
          customer_name: form.customer_name,
          customer_phone: form.customer_phone || null,
          customer_address: form.customer_address || null,
          lr_number: form.lr_number || null,
          items: { meta, line_items: lineItems },
          subtotal,
          gst_percent: parseFloat(form.gst_percent) || 0,
          gst_amount: gstAmt,
          total_amount: total,
          notes: form.notes || null,
          invoice_number: "",
        })
      });
      if (!res.ok) {
        throw new Error("Failed to create document");
      }
      toast.success(`${docType} created!`);
      setShowAdd(false);
      fetchInvoices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create document");
    }
  };

  const handlePrint = (inv: Invoice) => {
    printDocument(inv);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/invoices/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      toast.success("Document deleted");
      fetchInvoices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const filtered = invoices.filter(i =>
    (i.invoice_number || "").toLowerCase().includes(search.toLowerCase()) ||
    i.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    i.invoice_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search invoice, customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Button onClick={() => { resetForm("Bill"); setShowAdd(true); }} className="gradient-accent text-accent-foreground border-0">
            <Plus className="w-4 h-4 mr-1" /> Create Document
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Doc No.</TableHead><TableHead>Type</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No documents</TableCell></TableRow>
              ) : filtered.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                  <TableCell><Badge className="bg-primary/10 text-primary">{inv.invoice_type}</Badge></TableCell>
                  <TableCell>{inv.customer_name}</TableCell>
                  <TableCell className="font-semibold">₹{Number(inv.total_amount).toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewInv(inv)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handlePrint(inv)}><Printer className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Document Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Document</DialogTitle></DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Document Type</label>
              <Select value={docType} onValueChange={v => resetForm(v as DocType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{docType === "LR Copy" ? "Consignor Name *" : "Customer Name *"}</label>
              <Input value={form.customer_name || ""} onChange={e => setForm({ ...form, customer_name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Phone</label>
              <Input value={form.customer_phone || ""} onChange={e => setForm({ ...form, customer_phone: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">LR Number</label>
              <Input value={form.lr_number || ""} onChange={e => setForm({ ...form, lr_number: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">GST Number</label>
              <Input placeholder="e.g. 24XXXXX1234X1ZX" value={form.gst_number || ""} onChange={e => setForm({ ...form, gst_number: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground">Address</label>
              <Input value={form.customer_address || ""} onChange={e => setForm({ ...form, customer_address: e.target.value })} />
            </div>
          </div>

          {/* Type-specific fields */}
          {docType === "LR Copy" && <LRCopyFields form={form} setForm={setForm} />}
          {docType === "Quotation" && <QuotationFields form={form} setForm={setForm} isQuotation={true} />}
          {docType === "Money Receipt" && <MoneyReceiptFields form={form} setForm={setForm} />}
          {docType === "Bill" && <BillFields form={form} setForm={setForm} />}
          {docType === "Packing List" && <QuotationFields form={form} setForm={setForm} />}

          {docType !== "Money Receipt" && docType !== "Quotation" && docType !== "Packing List" && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="text-xs text-muted-foreground">GST % <span className="text-muted-foreground/60">(leave blank for no GST)</span></label><Input type="number" placeholder="e.g. 18" value={form.gst_percent || ""} onChange={e => setForm({ ...form, gst_percent: e.target.value })} /></div>
              <div><label className="text-xs text-muted-foreground">Notes</label><Input value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
          )}

          <div className="text-right mt-4 space-y-1">
            {(() => { const { subtotal, gstAmt, total } = calcTotals(); return <>
              <p className="text-sm text-muted-foreground">Subtotal: ₹{subtotal.toLocaleString()}</p>
              {gstAmt > 0 && <p className="text-sm text-muted-foreground">GST: ₹{gstAmt.toLocaleString()}</p>}
              <p className="text-lg font-bold">Total: ₹{total.toLocaleString()}</p>
            </>; })()}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="gradient-accent text-accent-foreground border-0">Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View/Print Dialog */}
      <Dialog open={!!viewInv} onOpenChange={() => setViewInv(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{viewInv?.invoice_number} - {viewInv?.invoice_type}</span>
              <Button variant="outline" size="sm" onClick={() => viewInv && handlePrint(viewInv)}><Printer className="w-4 h-4 mr-1" /> Print</Button>
            </DialogTitle>
          </DialogHeader>
          {viewInv && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Customer:</span> <strong>{viewInv.customer_name}</strong></div>
                <div><span className="text-muted-foreground">Date:</span> {new Date(viewInv.created_at).toLocaleDateString()}</div>
                {viewInv.customer_phone && <div><span className="text-muted-foreground">Phone:</span> {viewInv.customer_phone}</div>}
                {viewInv.lr_number && <div><span className="text-muted-foreground">LR:</span> {viewInv.lr_number}</div>}
                {viewInv.customer_address && <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {viewInv.customer_address}</div>}
              </div>
              <div className="border-t pt-3">
                <p className="text-lg font-bold text-right">Total: ₹{Number(viewInv.total_amount).toLocaleString()}</p>
              </div>
              {viewInv.notes && <p className="text-muted-foreground text-xs">Notes: {viewInv.notes}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// ==================== LR Copy Fields ====================
function LRCopyFields({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const updateItem = (idx: number, field: string, val: any) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: val };
    if (field === "rate" || field === "packages") {
      items[idx].freight = (parseFloat(items[idx].rate) || 0) * (parseFloat(items[idx].packages) || 1);
    }
    setForm({ ...form, items });
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground">Consignee Name</label><Input value={form.consignee_name} onChange={e => setForm({ ...form, consignee_name: e.target.value })} /></div>
        <div><label className="text-xs text-muted-foreground">Consignee Address</label><Input value={form.consignee_address} onChange={e => setForm({ ...form, consignee_address: e.target.value })} /></div>
        <div><label className="text-xs text-muted-foreground">From</label><Input value={form.from_location} onChange={e => setForm({ ...form, from_location: e.target.value })} /></div>
        <div><label className="text-xs text-muted-foreground">To</label><Input value={form.to_location} onChange={e => setForm({ ...form, to_location: e.target.value })} /></div>
        <div>
          <label className="text-xs text-muted-foreground">Payment Type</label>
          <Select value={form.payment_type} onValueChange={v => setForm({ ...form, payment_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="To Pay">To Pay</SelectItem>
              <SelectItem value="TBB">TBB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Packages</label>
          <Button variant="outline" size="sm" onClick={() => setForm({ ...form, items: [...form.items, { description: "", packages: "", weight_actual: "", weight_charged: "", rate: 0, freight: 0 }] })}><Plus className="w-3 h-3 mr-1" /> Add</Button>
        </div>
        {form.items.map((item: any, idx: number) => (
          <div key={idx} className="grid grid-cols-12 gap-2 mb-2 items-end">
            <div className="col-span-3"><Input placeholder="Description" value={item.description} onChange={e => updateItem(idx, "description", e.target.value)} /></div>
            <div className="col-span-1"><Input placeholder="Pkgs" value={item.packages} onChange={e => updateItem(idx, "packages", e.target.value)} /></div>
            <div className="col-span-2"><Input placeholder="Wt Actual" value={item.weight_actual} onChange={e => updateItem(idx, "weight_actual", e.target.value)} /></div>
            <div className="col-span-2"><Input placeholder="Wt Charged" value={item.weight_charged} onChange={e => updateItem(idx, "weight_charged", e.target.value)} /></div>
            <div className="col-span-2"><Input type="number" placeholder="Rate" value={item.rate} onChange={e => updateItem(idx, "rate", e.target.value)} /></div>
            <div className="col-span-1 text-sm font-medium pt-2">₹{(parseFloat(item.freight) || 0).toLocaleString()}</div>
            <div className="col-span-1">{form.items.length > 1 && <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, items: form.items.filter((_: any, i: number) => i !== idx) })}><Trash2 className="w-3 h-3" /></Button>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Quotation Fields ====================
function QuotationFields({ form, setForm, isQuotation = false }: { form: any; setForm: (f: any) => void; isQuotation?: boolean }) {
  const updateParticular = (idx: number, field: string, val: string) => {
    const particulars = [...(form.particulars || [])];
    particulars[idx] = { ...particulars[idx], [field]: val };
    setForm({ ...form, particulars });
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground">From Location</label><Input value={form.from_location} onChange={e => setForm({ ...form, from_location: e.target.value })} /></div>
        <div><label className="text-xs text-muted-foreground">To Location</label><Input value={form.to_location} onChange={e => setForm({ ...form, to_location: e.target.value })} /></div>
        {isQuotation && (
          <div><label className="text-xs text-muted-foreground">Appex. Date of Moment</label><Input type="date" value={form.moment_date || ""} onChange={e => setForm({ ...form, moment_date: e.target.value })} /></div>
        )}
      </div>

      {isQuotation && form.particulars && (
        <div>
          <label className="text-sm font-medium mb-2 block">Particulars</label>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-0 bg-muted px-3 py-2">
              <div className="col-span-1 text-xs font-semibold text-muted-foreground">S.No.</div>
              <div className="col-span-7 text-xs font-semibold text-muted-foreground">Particulars</div>
              <div className="col-span-4 text-xs font-semibold text-muted-foreground">Amount (₹)</div>
            </div>
            {form.particulars.map((p: any, idx: number) => (
              <div key={idx} className="grid grid-cols-12 gap-0 px-3 py-1 items-center border-t border-border">
                <div className="col-span-1 text-xs text-muted-foreground">{idx + 1}</div>
                <div className="col-span-7 text-xs">
                  {p.label}
                  {(idx === 2 || idx === 3) && (
                    <Input className="inline-block w-20 h-6 text-xs ml-2" placeholder="Floor" value={p.floor || ''} onChange={e => updateParticular(idx, 'floor', e.target.value)} />
                  )}
                </div>
                <div className="col-span-4">
                  <Input type="number" className="h-7 text-xs" placeholder="0" value={p.amount || ''} onChange={e => updateParticular(idx, 'amount', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isQuotation && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Articles</label>
            <Button variant="outline" size="sm" onClick={() => setForm({ ...form, articles: [...form.articles, { no: form.articles.length + 1, description: "" }] })}><Plus className="w-3 h-3 mr-1" /> Add</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {form.articles.map((art: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground w-6">{art.no}.</span>
                <Input placeholder="Article description" value={art.description} onChange={e => {
                  const articles = [...form.articles];
                  articles[idx] = { ...articles[idx], description: e.target.value };
                  setForm({ ...form, articles });
                }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div><label className="text-xs text-muted-foreground">Total Amount</label><Input type="number" value={form.notes_amount || ""} onChange={e => setForm({ ...form, notes_amount: e.target.value })} /></div>
            <div><label className="text-xs text-muted-foreground">Notes</label><Input value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
        </div>
      )}

      {isQuotation && (
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-muted-foreground">GST % <span className="text-muted-foreground/60">(leave blank for no GST)</span></label><Input type="number" placeholder="e.g. 18" value={form.gst_percent || ""} onChange={e => setForm({ ...form, gst_percent: e.target.value })} /></div>
          <div><label className="text-xs text-muted-foreground">Notes</label><Input value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
      )}
    </div>
  );
}

// ==================== Money Receipt Fields ====================
function MoneyReceiptFields({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground">Amount (₹)</label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} /></div>
        <div><label className="text-xs text-muted-foreground">Amount in Words</label><Input placeholder="e.g. Five Thousand Only" value={form.amount_words} onChange={e => setForm({ ...form, amount_words: e.target.value })} /></div>
        <div><label className="text-xs text-muted-foreground">Cheque/Cash/DD No.</label><Input value={form.payment_ref} onChange={e => setForm({ ...form, payment_ref: e.target.value })} /></div>
        <div><label className="text-xs text-muted-foreground">Payment Date</label><Input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} /></div>
        <div><label className="text-xs text-muted-foreground">Against Bill/CN No.</label><Input value={form.against_bill} onChange={e => setForm({ ...form, against_bill: e.target.value })} /></div>
        <div><label className="text-xs text-muted-foreground">Against Date</label><Input type="date" value={form.against_date} onChange={e => setForm({ ...form, against_date: e.target.value })} /></div>
      </div>
    </div>
  );
}

// ==================== Bill Fields ====================
function BillFields({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const updateParticular = (idx: number, field: string, val: string) => {
    const particulars = [...(form.particulars || [])];
    particulars[idx] = { ...particulars[idx], [field]: val };
    setForm({ ...form, particulars });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground font-semibold">From Location</label>
          <Input value={form.from_location || ''} onChange={e => setForm({ ...form, from_location: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-semibold">To Location</label>
          <Input value={form.to_location || ''} onChange={e => setForm({ ...form, to_location: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-semibold">Vehicle Number</label>
          <Input value={form.vehicle_number || ''} onChange={e => setForm({ ...form, vehicle_number: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-semibold">Vehicle Type</label>
          <Select value={form.vehicle_type || '4 Wheeler'} onValueChange={val => setForm({ ...form, vehicle_type: val })}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2 Wheeler">2 Wheeler</SelectItem>
              <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-semibold">HSN Code</label>
          <Input value={form.HSN_code || '9965'} onChange={e => setForm({ ...form, HSN_code: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-semibold">Weight</label>
          <Input value={form.weight || ''} onChange={e => setForm({ ...form, weight: e.target.value })} />
        </div>
        <div className="col-span-1 md:col-span-3">
          <label className="text-xs text-muted-foreground font-semibold">Rate</label>
          <Input value={form.rate || ''} onChange={e => setForm({ ...form, rate: e.target.value })} />
        </div>
      </div>

      {form.particulars && (
        <div className="space-y-2">
          <label className="text-sm font-semibold block text-gray-800">Charges Breakdown</label>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-0 bg-muted px-3 py-2">
              <div className="col-span-8 text-xs font-semibold text-muted-foreground">Charge Type</div>
              <div className="col-span-4 text-xs font-semibold text-muted-foreground">Amount (₹)</div>
            </div>
            {form.particulars.map((p: any, idx: number) => (
              <div key={idx} className="grid grid-cols-12 gap-0 px-3 py-1.5 items-center border-t border-border">
                <div className="col-span-8 text-xs font-semibold text-gray-700">{p.label}</div>
                <div className="col-span-4">
                  <Input 
                    type="number" 
                    className="h-8 text-xs" 
                    placeholder="0" 
                    value={p.amount || ''} 
                    onChange={e => updateParticular(idx, 'amount', e.target.value)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInvoices;