import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
//import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "@/config";

type ReportType = "parcels" | "delivered" | "pending_balance" | "customers" | "profit_loss";

const reportOptions: { value: ReportType; label: string }[] = [
  { value: "parcels", label: "Parcel Report" },
  { value: "delivered", label: "Delivery Report" },
  { value: "pending_balance", label: "Pending Balance Report" },
  { value: "customers", label: "Customer Report" },
  { value: "profit_loss", label: "Profit & Loss Report" },
];

const AdminReports = () => {
  const [reportType, setReportType] = useState<ReportType>("parcels");
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);

const generate = async () => {

  setLoading(true);

  let rows: Record<string, unknown>[] = [];

  let cols: string[] = [];

  try {

    switch (reportType) {

      case "parcels": {

        const res = await fetch(`${API_BASE_URL}/report/parcels`);

        rows = await res.json();

        cols = [
          "LR No.",
          "Customer",
          "Phone",
          "From",
          "To",
          "Status",
          "Amount",
          "Balance",
          "Payment",
          "Date"
        ];

        break;
      }

      case "delivered": {

        const res = await fetch(`${API_BASE_URL}/report/delivered`);

        rows = await res.json();

        cols = [
          "LR No.",
          "Customer",
          "From",
          "To",
          "Amount",
          "Payment",
          "Delivered Date"
        ];

        break;
      }

      case "pending_balance": {

        const res = await fetch(`${API_BASE_URL}/report/pending`);

        rows = await res.json();

        cols = [
          "LR No.",
          "Customer",
          "Phone",
          "Total",
          "Advance",
          "Balance",
          "Payment Status"
        ];

        break;
      }

      case "customers": {

        const res = await fetch(`${API_BASE_URL}/report/customers`);

        rows = await res.json();

        cols = [
          "Name",
          "Phone",
          "Email",
          "Category",
          "Address",
          "Since"
        ];

        break;
      }

      case "profit_loss": {

        const res = await fetch(`${API_BASE_URL}/report/profit-loss`);

        rows = await res.json();

        cols = [
          "Type",
          "Amount"
        ];

        break;
      }
    }

    setData(rows);

    setColumns(cols);

  } catch (err) {

    console.error(err);

    toast.error("Failed to generate report");

  } finally {

    setLoading(false);
  }
};

  const exportExcel = () => {
    if (data.length === 0) { toast.error("Generate report first"); return; }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(wb, `${reportType}_report.xlsx`);
    toast.success("Downloaded!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-64">
            <label className="text-xs text-muted-foreground mb-1 block">Report Type</label>
            <Select value={reportType} onValueChange={v => setReportType(v as ReportType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{reportOptions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={generate} className="gradient-accent text-accent-foreground border-0"><FileText className="w-4 h-4 mr-1" /> Generate</Button>
          <Button onClick={exportExcel} variant="outline" disabled={data.length === 0}><Download className="w-4 h-4 mr-1" /> Export Excel</Button>
        </div>

        {data.length > 0 && (
          <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
            <Table>
              <TableHeader><TableRow>{columns.map(c => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((val, j) => (
                    <TableCell key={j} className="text-sm">

                     {typeof val === "number"

    ? (val > 100
        ? `₹${val.toLocaleString()}`
        : val)

    : String(val || "-")}

</TableCell>
 ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Select a report type and click Generate</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
