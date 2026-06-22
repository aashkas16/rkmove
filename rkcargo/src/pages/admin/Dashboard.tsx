import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, CreditCard, TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { API_BASE_URL } from "@/config";
//import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, delivered: 0, pendingPayments: 0 });
  const [finance, setFinance] = useState({ income: 0, expense: 0, profit: 0, dueAlerts: 0 });
  const [chartData, setChartData] = useState<Record<string, unknown>[]>([]);
  const [activity, setActivity] = useState<Record<string, unknown>[]>([]);
  
  useEffect(() => {

  const load = async () => {

    try {

      const [
        parcelsRes,
        incomeRes,
        expenseRes,
        activityRes
      ] = await Promise.all([

        fetch(`${API_BASE_URL}/dashboard/parcels`),

        fetch(`${API_BASE_URL}/dashboard/income`),

        fetch(`${API_BASE_URL}/dashboard/expense`),

        fetch(`${API_BASE_URL}/dashboard/activity`)
      ]);

      const parcels = await parcelsRes.json();

      const incomeList = await incomeRes.json();

      const expenseList = await expenseRes.json();

      const logs = await activityRes.json();

      setStats({

        total: parcels.length,

        active: parcels.filter(
          (p: Record<string, unknown>) =>
            p.status !== "Delivered"
        ).length,

        delivered: parcels.filter(
          (p: Record<string, unknown>) =>
            p.status === "Delivered"
        ).length,

        pendingPayments: parcels.filter(
          (p: Record<string, unknown>) =>
            p.payment_status !== "Paid"
        ).length
      });

      const totalIncome =
        incomeList.reduce(
          (s: number, i: Record<string, unknown>) =>
            s + Number(i.amount),
          0
        );

      const totalExpense =
        expenseList.reduce(
          (s: number, e: Record<string, unknown>) =>
            s + Number(e.amount),
          0
        );

      setFinance({

        income: totalIncome,

        expense: totalExpense,

        profit: totalIncome - totalExpense,

        dueAlerts: parcels.filter(
          (p: Record<string, unknown>) =>
            Number(p.balance) > 0
        ).length
      });

      const months:
      Record<string, { income: number; expense: number }> = {};

      incomeList.forEach(
        (i: Record<string, unknown>) => {

          const date = String(i.date || "");

          const m = date.substring(0, 7);

          if (m) {

            if (!months[m]) {

              months[m] = {
                income: 0,
                expense: 0
              };
            }

            months[m].income += Number(i.amount);
          }
        }
      );

      expenseList.forEach(
        (e: Record<string, unknown>) => {

          const date = String(e.date || "");

          const m = date.substring(0, 7);

          if (m) {

            if (!months[m]) {

              months[m] = {
                income: 0,
                expense: 0
              };
            }

            months[m].expense += Number(e.amount);
          }
        }
      );

      setChartData(

        Object.entries(months)

          .sort()

          .slice(-6)

          .map(([month, v]) => ({
            month,
            ...v
          }))
      );

      setActivity(logs || []);

    } catch (err) {

      console.error(err);
    }
  };

  load();

}, []);


  const statCards = [
    { label: "Total Parcels", value: stats.total.toLocaleString(), icon: Package, color: "gradient-primary" },
    { label: "Active Shipments", value: stats.active.toLocaleString(), icon: Truck, color: "gradient-accent" },
    { label: "Delivered", value: stats.delivered.toLocaleString(), icon: CheckCircle2, color: "bg-[hsl(142,70%,45%)]" },
    { label: "Pending Payments", value: stats.pendingPayments.toLocaleString(), icon: CreditCard, color: "bg-destructive" },
  ];

  const financeCards = [
    { label: "Total Income", value: `₹${finance.income.toLocaleString()}`, icon: TrendingUp, positive: true },
    { label: "Total Expense", value: `₹${finance.expense.toLocaleString()}`, icon: TrendingDown, positive: false },
    { label: "Net Profit", value: `₹${finance.profit.toLocaleString()}`, icon: DollarSign, positive: finance.profit >= 0 },
    { label: "Due Alerts", value: finance.dueAlerts.toString(), icon: AlertCircle, positive: false },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {financeCards.map((f, i) => (
            <motion.div key={f.label} variants={fadeUp} custom={i + 4} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-center gap-3">
                <f.icon className={`w-5 h-5 ${f.positive ? "text-[hsl(142,70%,45%)]" : "text-destructive"}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="font-display text-lg font-bold text-foreground">{f.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4">Revenue vs Expense</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                  formatter={(v: number | string) =>
                  `₹${Number(v).toLocaleString()}`
                    }
                  />
                <Bar dataKey="income" fill="hsl(215 80% 45%)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="hsl(25 95% 53%)" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-20">No data yet. Add income & expenses to see charts.</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-xl border border-border p-5 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4">Recent Activity</h3>
            {activity.length > 0 ? (
              <div className="space-y-3">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-primary" />
                    <div className="min-w-0">
                      <p className="text-foreground truncate">{String(a.action)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(
  String(a.created_at)
).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-10">No activity logged yet</p>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
