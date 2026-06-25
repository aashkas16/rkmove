import { useEffect, useState } from "react";
import { Eye, Edit2, Plus, Trash2 } from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Parcel {
id: number;
customer_name: string;
lr_number: string;
customer_phone: string;
from_location: string;
to_location: string;
weight: string;
vehicle: string;
total_amount: number;
balance: number;
payment_status: string;
status: string;
description: string;
current_location: string;
advance_paid: number;
expected_delivery: string;
remarks: string;
}

const AdminParcels = () => {
const [parcels, setParcels] = useState<Parcel[]>([]);
const [search, setSearch] = useState("");

const [showAdd, setShowAdd] = useState(false);

const [viewParcel, setViewParcel] = useState<Parcel | null>(null);
const [editParcel, setEditParcel] = useState<Parcel | null>(null);

const [form, setForm] = useState({
  customer_name: "",
  lr_number: "",
  customer_phone: "",
  from_location: "",
  to_location: "",
  description: "",
  current_location: "",
  weight: "",
  vehicle: "",
  total_amount: "",
  balance: "",
  advance_paid: "",
  payment_status: "",
  expected_delivery: "",
  remarks: "",
  status: "Booked",
});

const fetchParcels = async () => {
try {
const res = await fetch(`${API_BASE_URL}/parcels`);
const data = await res.json();
setParcels(data || []);
} catch (err) {
console.error(err);
}
};

useEffect(() => {
fetchParcels();
}, []);

const resetForm = () => {
setForm({
customer_name: "",
  lr_number: "",
  customer_phone: "",
  from_location: "",
  to_location: "",
  description: "",
  current_location: "",
  weight: "",
  vehicle: "",
  total_amount: "",
  balance: "",
  advance_paid: "",
  payment_status: "",
  expected_delivery: "",
  remarks: "",
  status: "Booked",
});
};

const handleAdd = async () => {
try {
await fetch(`${API_BASE_URL}/parcels`, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({

  lr_number: form.lr_number,

  customer_name: form.customer_name,

  customer_phone: form.customer_phone,

  from_location: form.from_location,

  to_location: form.to_location,

  description: form.description,

  current_location: form.current_location,

  weight: form.weight,

  vehicle: form.vehicle,

  total_amount: Number(form.total_amount),

  advance_paid: Number(form.advance_paid),

  balance:
    Number(form.total_amount) -
    Number(form.advance_paid),

  payment_status: form.payment_status,

  expected_delivery: form.expected_delivery,

  remarks: form.remarks,

  status: form.status
}),
});


  toast.success("Parcel Added");

  setShowAdd(false);

  resetForm();

  fetchParcels();
} catch (err) {
  console.error(err);
  toast.error("Failed to add parcel");
}


};

const handleUpdate = async () => {
if (!editParcel) return;

try {
  await fetch(`${API_BASE_URL}/parcels/${editParcel.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({

  lr_number: form.lr_number,

  customer_name: form.customer_name,

  customer_phone: form.customer_phone,

  from_location: form.from_location,

  to_location: form.to_location,

  description: form.description,

  current_location: form.current_location,

  weight: form.weight,

  vehicle: form.vehicle,

  total_amount: Number(form.total_amount),

  advance_paid: Number(form.advance_paid),

  balance:
    Number(form.total_amount) -
    Number(form.advance_paid),

  payment_status: form.payment_status,

  expected_delivery: form.expected_delivery,

  remarks: form.remarks,

  status: form.status
}),
  });

  toast.success("Parcel Updated");

  setEditParcel(null);

  fetchParcels();
} catch (err) {
  console.error(err);
  toast.error("Failed to update");
}


};

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this parcel?")) return;
  try {
    const res = await fetch(`${API_BASE_URL}/parcels/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Parcel Deleted");
      fetchParcels();
    } else {
      toast.error("Failed to delete parcel");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error deleting parcel");
  }
};

const filtered = parcels.filter((p) =>
p.customer_name
?.toLowerCase()
.includes(search.toLowerCase())
);

return ( <AdminLayout> <div className="max-w-[1200px] mx-auto space-y-6">

    <div className="flex justify-between items-center">
      <Input
        placeholder="Search parcels..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button onClick={() => setShowAdd(true)}>
        <Plus className="w-4 h-4 mr-1" />
        Add Parcel
      </Button>
    </div>

    <div className="bg-white rounded-xl shadow p-4">

      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>LR No.</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {filtered.map((p) => (

            <TableRow key={p.id}>

              <TableCell>
                {p.lr_number}
              </TableCell>

              <TableCell>
                {p.customer_name}
              </TableCell>

              <TableCell>
                {p.from_location} → {p.to_location}
              </TableCell>

              <TableCell>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {p.status}
                </span>
              </TableCell>

              <TableCell className="font-semibold">
               ₹{p.total_amount}
              </TableCell>

              <TableCell className="text-orange-500 font-semibold">
                ₹{p.balance}
              </TableCell>

              <TableCell className="flex gap-2">

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setViewParcel(p)}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditParcel(p);

                    setForm({
  customer_name: p.customer_name || "",
  lr_number: p.lr_number || "",
customer_phone: p.customer_phone || "",
  from_location: p.from_location || "",
  to_location: p.to_location || "",
  description: p.description || "",
  current_location: p.current_location || "",
  weight: p.weight || "",
  vehicle: p.vehicle || "",
 total_amount: String(p.total_amount || ""),
balance: String(p.balance || ""),
  advance_paid: String(p.advance_paid || ""),
  payment_status: p.payment_status || "",
  expected_delivery: p.expected_delivery || "",
  remarks: p.remarks || "",
  status: p.status || "Booked",
});
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>

    <Dialog open={showAdd} onOpenChange={setShowAdd}>

      <DialogContent className="max-w-2xl">

        <Dialog
  open={showAdd}
  onOpenChange={setShowAdd}
>
  <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto rounded-2xl">

<DialogHeader>
  <DialogTitle className="text-3xl font-bold">
    Add New Parcel
  </DialogTitle>
</DialogHeader>

<div className="grid grid-cols-2 gap-3 mt-3">

          <div>
  <label className="text-sm text-gray-500">
    LR Number *
  </label>

  <Input
    value={form.lr_number}
    onChange={(e) =>
      setForm({
        ...form,
        lr_number: e.target.value
      })
    }
  />
</div>

  <div>
    <label className="text-sm text-gray-500">
      Customer Name *
    </label>

    <Input
      value={form.customer_name}
      onChange={(e) =>
        setForm({
          ...form,
          customer_name: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Phone *
    </label>

    <Input
      value={form.customer_phone}
      onChange={(e) =>
        setForm({
          ...form,
          customer_phone: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      From *
    </label>

    <Input
      value={form.from_location}
      onChange={(e) =>
        setForm({
          ...form,
          from_location: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      To *
    </label>

    <Input
      value={form.to_location}
      onChange={(e) =>
        setForm({
          ...form,
          to_location: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Description
    </label>

   <Input
  value={form.description}
  onChange={(e) =>
    setForm({
      ...form,
      description: e.target.value
    })
  }
/>
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Vehicle Number
    </label>

    <Input
      value={form.vehicle}
      onChange={(e) =>
        setForm({
          ...form,
          vehicle: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Current Location
    </label>

    <Input
  value={form.current_location}
  onChange={(e) =>
    setForm({
      ...form,
      current_location: e.target.value
    })
  }
/>
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Status
    </label>

    <select
      value={form.status}
      onChange={(e) =>
        setForm({
          ...form,
          status: e.target.value
        })
      }
      className="w-full border rounded-md h-11 px-3"
    >
      <option>Booked</option>
      <option>Packed</option>
      <option>In Transit</option>
      <option>Reached Hub</option>
      <option>Out for Delivery</option>
      <option>Delivered</option>
    </select>
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Total Amount
    </label>

    <Input
      value={form.total_amount}
      onChange={(e) =>
        setForm({
          ...form,
          total_amount: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Advance Paid
    </label>

    <Input
  value={form.advance_paid}
  onChange={(e) =>
    setForm({
      ...form,
      advance_paid: e.target.value
    })
  }
/>
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Payment Status
    </label>

    <select
      value={form.payment_status}
      onChange={(e) =>
        setForm({
          ...form,
          payment_status: e.target.value
        })
      }
      className="w-full border rounded-md h-11 px-3"
    >
      <option>Pending</option>
      <option>Partial</option>
      <option>Paid</option>
    </select>
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Expected Delivery
    </label>

    <Input
  type="date"
  value={form.expected_delivery}
  onChange={(e) =>
    setForm({
      ...form,
      expected_delivery: e.target.value
    })
  }
/>
  </div>

  <div className="col-span-2">
    <label className="text-sm text-gray-500">
      Remarks
    </label>

    <textarea
  className="w-full border rounded-md p-2 h-20"
  placeholder="Remarks"
  value={form.remarks}
  onChange={(e) =>
    setForm({
      ...form,
      remarks: e.target.value
    })
  }
/>
  </div>

</div>

<div className="flex justify-end gap-3 mt-4 pb-1">

  <Button
    variant="outline"
    onClick={() => setShowAdd(false)}
  >
    Cancel
  </Button>

  <Button
    className="bg-orange-500 hover:bg-orange-600"
    onClick={handleAdd}
  >
    Add Parcel
  </Button>

</div>

  </DialogContent>
</Dialog>

      </DialogContent>

    </Dialog>

    <Dialog
      open={!!viewParcel}
      onOpenChange={() => setViewParcel(null)}
    >
      <DialogContent className="max-w-2xl">

        <Dialog
  open={!!viewParcel}
  onOpenChange={() => setViewParcel(null)}
>
  <DialogContent className="max-w-xl rounded-2xl">
<DialogHeader>
  <DialogTitle className="text-2xl font-bold">
    Parcel Details - RKCPM202605{viewParcel?.id}
  </DialogTitle>
</DialogHeader>

{viewParcel && (

  <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-sm mt-4">

    <div>
      <p className="text-gray-500">Customer:</p>
      <p className="font-medium">
        {viewParcel.customer_name || "N/A"}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Phone:</p>
      <p className="font-medium">
        {viewParcel.customer_phone || "N/A"}
      </p>
    </div>

    <div>
      <p className="text-gray-500">From:</p>
      <p className="font-medium">
        {viewParcel.from_location || "N/A"}
      </p>
    </div>

    <div>
      <p className="text-gray-500">To:</p>
      <p className="font-medium">
        {viewParcel.to_location || "N/A"}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Status:</p>

      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
        {viewParcel.status}
      </span>
    </div>

    <div>
      <p className="text-gray-500">Vehicle:</p>
      <p className="font-medium">
        {viewParcel.vehicle || "N/A"}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Total:</p>
      <p className="font-semibold">
        ₹{viewParcel.total_amount || 0}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Balance:</p>
      <p className="font-semibold text-orange-500">
        ₹{viewParcel.balance || 0}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Payment:</p>
      <p className="font-medium">
        {viewParcel.payment_status || "Pending"}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Expected Delivery:</p>
      <p className="font-medium">
        {viewParcel.expected_delivery || "N/A"}
      </p>
    </div>

    <div className="col-span-2">
      <p className="text-gray-500">Description:</p>
      <p className="font-medium">
        {viewParcel.description || "N/A"}
      </p>
    </div>

    <div className="col-span-2">
      <p className="text-gray-500">Remarks:</p>
      <p className="font-medium">
        {viewParcel.remarks || "N/A"}
      </p>
    </div>

  </div>

)}


  </DialogContent>
</Dialog>


      </DialogContent>
    </Dialog>

    <Dialog
      open={!!editParcel}
      onOpenChange={() => setEditParcel(null)}
    >

      <DialogContent>

        <Dialog
  open={!!editParcel}
  onOpenChange={() => setEditParcel(null)}
>
  <DialogContent className="max-w-2xl rounded-2xl">
<Dialog
  open={!!editParcel}
  onOpenChange={() => setEditParcel(null)}
>
  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">

<DialogHeader>
  <DialogTitle className="text-3xl font-bold">
    Edit Parcel - RKCPM202605{editParcel?.id}
  </DialogTitle>
</DialogHeader>

<div className="grid grid-cols-2 gap-4 mt-4">

  <div>
    <label className="text-sm text-gray-500">
      Customer Name *
    </label>

    <Input
      value={form.customer_name}
      onChange={(e) =>
        setForm({
          ...form,
          customer_name: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Phone *
    </label>

    <Input
      value={form.customer_phone}
      onChange={(e) =>
        setForm({
          ...form,
          customer_phone: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      From *
    </label>

    <Input
      value={form.from_location}
      onChange={(e) =>
        setForm({
          ...form,
          from_location: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      To *
    </label>

    <Input
      value={form.to_location}
      onChange={(e) =>
        setForm({
          ...form,
          to_location: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Description
    </label>

    <Input placeholder="Description" />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Vehicle Number
    </label>

    <Input
      value={form.vehicle}
      onChange={(e) =>
        setForm({
          ...form,
          vehicle: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Current Location
    </label>

    <Input placeholder="Current Location" />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Status
    </label>

    <select
      value={form.status}
      onChange={(e) =>
        setForm({
          ...form,
          status: e.target.value
        })
      }
      className="w-full border rounded-md h-11 px-3"
    >
      <option>Booked</option>
      <option>Packed</option>
      <option>In Transit</option>
      <option>Reached Hub</option>
      <option>Out for Delivery</option>
      <option>Delivered</option>
    </select>
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Total Amount
    </label>

    <Input
      value={form.total_amount}
      onChange={(e) =>
        setForm({
          ...form,
          total_amount: e.target.value
        })
      }
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Advance Paid
    </label>

    <Input placeholder="0" />
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Payment Status
    </label>

    <select
      value={form.payment_status}
      onChange={(e) =>
        setForm({
          ...form,
          payment_status: e.target.value
        })
      }
      className="w-full border rounded-md h-11 px-3"
    >
      <option>Pending</option>
      <option>Partial</option>
      <option>Paid</option>
    </select>
  </div>

  <div>
    <label className="text-sm text-gray-500">
      Expected Delivery
    </label>

    <Input type="date" />
  </div>

  <div className="col-span-2">
    <label className="text-sm text-gray-500">
      Remarks
    </label>

    <textarea
      className="w-full border rounded-md p-2 h-20"
      placeholder="Remarks"
    />
  </div>

</div>

<div className="flex justify-end gap-3 mt-8">

  <Button
    variant="outline"
    onClick={() => setEditParcel(null)}
  >
    Cancel
  </Button>

  <Button
    className="bg-orange-500 hover:bg-orange-600"
    onClick={handleUpdate}
  >
    Update
  </Button>

</div>

  </DialogContent>
</Dialog>


  </DialogContent>
</Dialog>


      </DialogContent>

    </Dialog>

  </div>
</AdminLayout>

);
};

export default AdminParcels;
