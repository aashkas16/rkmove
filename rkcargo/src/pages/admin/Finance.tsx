import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "@/config";

const paymentModes = ["Cash", "UPI", "Bank", "Cheque"];
const expenseCategories = ["Fuel", "Toll", "Labour", "Maintenance", "Office Expense", "Other"];

const AdminFinance = () => {
 // const { user } = useAuth();
  const [incomeList, setIncomeList] = useState<Record<string, unknown>[]>([]);
  const [expenseList, setExpenseList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [incForm, setIncForm] = useState({ client_name: "", lr_number: "", amount: "", payment_mode: "Cash", description: "", date: new Date().toISOString().split("T")[0] });
  const [expForm, setExpForm] = useState({ category: "Fuel", amount: "", description: "", vehicle_number: "", date: new Date().toISOString().split("T")[0] });

  /*const fetchData = async () => {
    const [inc, exp] = await Promise.all([
      supabase.from("income").select("*").order("date", { ascending: false }),
      supabase.from("expenditure").select("*").order("date", { ascending: false }),
    ]);
    setIncomeList((inc.data as any[]) || []);
    setExpenseList((exp.data as any[]) || []);
    setLoading(false);
  };*/

  const fetchData = async () => {

  try {

    const [incRes, expRes] = await Promise.all([

      fetch(`${API_BASE_URL}/income`),

      fetch(`${API_BASE_URL}/expenditure`)
    ]);

    const income = await incRes.json();

    const expense = await expRes.json();

    setIncomeList(income || []);

    setExpenseList(expense || []);

    setLoading(false);

  } catch (err) {

    console.error(err);

    toast.error("Failed to load finance data");
  }
};

  useEffect(() => { fetchData(); }, []);

  const totalIncome = incomeList.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpense = expenseList.reduce((s, e) => s + Number(e.amount), 0);
  const profit = totalIncome - totalExpense;

  /*const handleAddIncome = async () => {
    const { error } = await supabase.from("income").insert({
      client_name: incForm.client_name || null, lr_number: incForm.lr_number || null,
      amount: parseFloat(incForm.amount), payment_mode: incForm.payment_mode,
      description: incForm.description || null, date: incForm.date, created_by: user?.id,
    } as any);
    if (error) { toast.error(error.message); return; }
    toast.success("Income added!"); setShowIncome(false); fetchData();
  }; */

  const handleAddIncome = async () => {

  try {

    await fetch(`${API_BASE_URL}/income`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        client_name: incForm.client_name || null,

        lr_number: incForm.lr_number || null,

        amount: parseFloat(incForm.amount),

        payment_mode: incForm.payment_mode,

        description: incForm.description || null,

        date: incForm.date
      })
    });

    toast.success("Income added!");

    setShowIncome(false);

    fetchData();

  } catch (err) {

    console.error(err);

    toast.error("Failed");
  }
};

  /* const handleAddExpense = async () => {
    const { error } = await supabase.from("expenditure").insert({
      category: expForm.category, amount: parseFloat(expForm.amount),
      description: expForm.description || null, vehicle_number: expForm.vehicle_number || null,
      date: expForm.date, created_by: user?.id,
    } as any);
    if (error) { toast.error(error.message); return; }
    toast.success("Expense added!"); setShowExpense(false); fetchData();
  }; */

  const handleAddExpense = async () => {

  try {

    await fetch(`${API_BASE_URL}/expenditure`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        category: expForm.category,

        amount: parseFloat(expForm.amount),

        description: expForm.description || null,

        vehicle_number: expForm.vehicle_number || null,

        date: expForm.date
      })
    });

    toast.success("Expense added!");

    setShowExpense(false);

    fetchData();

  } catch (err) {

    console.error(err);

    toast.error("Failed");
  }
};

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(incomeList.map(i => ({ Date: i.date, Client: i.client_name, LR: i.lr_number, Amount: i.amount, Mode: i.payment_mode }))), "Income");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expenseList.map(e => ({ Date: e.date, Category: e.category, Amount: e.amount, Description: e.description, Vehicle: e.vehicle_number }))), "Expenditure");
    XLSX.writeFile(wb, "Finance_Report.xlsx");
    toast.success("Report downloaded!");
  };

  // Simple monthly chart data
  const getMonthlyData = () => {
    const months: Record<string, { income: number; expense: number }> = {};
    incomeList.forEach(i => {
      const m = String(i.date || "").substring(0, 7) || "Unknown";
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      months[m].income += Number(i.amount);
    });
    expenseList.forEach(e => {
      const m = String(e.date || "").substring(0, 7) || "Unknown";
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      months[m].expense += Number(e.amount);
    });
    return Object.entries(months).sort().slice(-6).map(([m, v]) => ({ month: m, ...v }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[hsl(142,70%,45%)] flex items-center justify-center"><TrendingUp className="w-5 h-5 text-primary-foreground" /></div>
            <div><p className="text-xs text-muted-foreground">Total Income</p><p className="font-display text-xl font-bold text-foreground">₹{totalIncome.toLocaleString()}</p></div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-destructive flex items-center justify-center"><TrendingDown className="w-5 h-5 text-primary-foreground" /></div>
            <div><p className="text-xs text-muted-foreground">Total Expense</p><p className="font-display text-xl font-bold text-foreground">₹{totalExpense.toLocaleString()}</p></div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center"><DollarSign className="w-5 h-5 text-primary-foreground" /></div>
            <div><p className="text-xs text-muted-foreground">Net Profit</p><p className={`font-display text-xl font-bold ${profit >= 0 ? "text-[hsl(142,70%,35%)]" : "text-destructive"}`}>₹{profit.toLocaleString()}</p></div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="income" fill="hsl(142,70%,45%)" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setShowIncome(true)} className="gradient-accent text-accent-foreground border-0"><Plus className="w-4 h-4 mr-1" /> Add Income</Button>
          <Button onClick={() => setShowExpense(true)} variant="outline"><Plus className="w-4 h-4 mr-1" /> Add Expense</Button>
          <Button onClick={exportExcel} variant="outline"><Download className="w-4 h-4 mr-1" /> Export Excel</Button>
        </div>

        <Tabs defaultValue="income">
          <TabsList><TabsTrigger value="income">Income</TabsTrigger><TabsTrigger value="expense">Expenditure</TabsTrigger></TabsList>
          <TabsContent value="income">
            <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Date</TableHead><TableHead>Client</TableHead><TableHead>LR No.</TableHead><TableHead>Amount</TableHead><TableHead>Mode</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {incomeList.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No income entries</TableCell></TableRow>
                  ) : incomeList.map(i => (
                    <TableRow key={String(i.id)}>

  <TableCell>
    {String(i.date || "")}
  </TableCell>

  <TableCell>
    {String(i.client_name || "-")}
  </TableCell>

  <TableCell className="font-mono text-xs">
    {String(i.lr_number || "-")}
  </TableCell>

  <TableCell className="font-semibold text-[hsl(142,70%,35%)]">
    ₹{Number(i.amount || 0).toLocaleString()}
  </TableCell>

  <TableCell>
    {String(i.payment_mode || "")}
  </TableCell>

</TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="expense">
            <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Description</TableHead><TableHead>Vehicle</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {expenseList.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No expense entries</TableCell></TableRow>
                  ) : expenseList.map(e => (
                    <TableRow key={String(e.id)}>

  <TableCell>
    {String(e.date || "")}
  </TableCell>

  <TableCell>
    {String(e.category || "")}
  </TableCell>

  <TableCell className="font-semibold text-destructive">
    ₹{Number(e.amount || 0).toLocaleString()}
  </TableCell>

  <TableCell className="text-sm">
    {String(e.description || "-")}
  </TableCell>

  <TableCell className="text-xs">
    {String(e.vehicle_number || "-")}
  </TableCell>

</TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Income Dialog */}
      <Dialog open={showIncome} onOpenChange={setShowIncome}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Income</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-muted-foreground">Client Name</label><Input value={incForm.client_name} onChange={e => setIncForm({...incForm, client_name: e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">LR Number</label><Input value={incForm.lr_number} onChange={e => setIncForm({...incForm, lr_number: e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">Amount *</label><Input type="number" value={incForm.amount} onChange={e => setIncForm({...incForm, amount: e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">Payment Mode</label>
              <Select value={incForm.payment_mode} onValueChange={v => setIncForm({...incForm, payment_mode: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{paymentModes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs text-muted-foreground">Date</label><Input type="date" value={incForm.date} onChange={e => setIncForm({...incForm, date: e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">Description</label><Input value={incForm.description} onChange={e => setIncForm({...incForm, description: e.target.value})} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowIncome(false)}>Cancel</Button>
            <Button onClick={handleAddIncome} className="gradient-accent text-accent-foreground border-0">Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={showExpense} onOpenChange={setShowExpense}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-muted-foreground">Category *</label>
              <Select value={expForm.category} onValueChange={v => setExpForm({...expForm, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{expenseCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs text-muted-foreground">Amount *</label><Input type="number" value={expForm.amount} onChange={e => setExpForm({...expForm, amount: e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">Vehicle Number</label><Input value={expForm.vehicle_number} onChange={e => setExpForm({...expForm, vehicle_number: e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">Date</label><Input type="date" value={expForm.date} onChange={e => setExpForm({...expForm, date: e.target.value})} /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Description</label><Input value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowExpense(false)}>Cancel</Button>
            <Button onClick={handleAddExpense} className="gradient-accent text-accent-foreground border-0">Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminFinance;
