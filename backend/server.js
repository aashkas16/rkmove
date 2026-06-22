const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "root123",
database: "rkcargo"
});

// ================= TEST =================
app.get("/test", (req, res) => {
res.send("Backend working");
});

// ================= CUSTOMERS =================

// GET customers
app.get("/customers", (req, res) => {
db.query("SELECT * FROM customers", (err, result) => {
if (err) return res.send(err);
res.send(result);
});
});

// ADD customer
app.post("/customers", (req, res) => {
const { name, phone, email, address } = req.body;

db.query(
"INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)",
[name, phone, email, address],
(err, result) => {
if (err) return res.send(err);
res.send("Inserted");
}
);
});

// DELETE customer
app.delete("/customers/:id", (req, res) => {
const id = req.params.id;

db.query(
"DELETE FROM customers WHERE id = ?",
[id],
(err, result) => {
if (err) return res.send(err);
res.send("Deleted");
}
);
});

// UPDATE customer
app.put("/customers/:id", (req, res) => {
const id = req.params.id;
const { name, phone, email, address } = req.body;

db.query(
"UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?",
[name, phone, email, address, id],
(err, result) => {
if (err) return res.send(err);
res.send("Updated");
}
);
});

// ================= PARCELS =================

// GET parcels
app.get("/parcels", (req, res) => {
db.query("SELECT * FROM parcels", (err, result) => {
if (err) return res.send(err);
res.send(result);
});
});

// ADD parcel (UPDATED)
// ADD parcel
app.post("/parcels", (req, res) => {

  const {

    lr_number,
    customer_name,
    customer_phone,
    from_location,
    to_location,
    current_location,
    weight,
    vehicle,
    total_amount,
    advance_paid,
    balance,
    payment_status,
    status,
    expected_delivery,
    description,
    remarks

  } = req.body;

  db.query(

    `INSERT INTO parcels
    (
      lr_number,
      customer_name,
      customer_phone,
      from_location,
      to_location,
      current_location,
      weight,
      vehicle,
      total_amount,
      advance_paid,
      balance,
      payment_status,
      status,
      expected_delivery,
      description,
      remarks
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

    [
      lr_number,
      customer_name,
      customer_phone,
      from_location,
      to_location,
      current_location,
      weight,
      vehicle,
      total_amount,
      advance_paid,
      balance,
      payment_status,
      status,
      expected_delivery,
      description,
      remarks
    ],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.send(err);
      }

      res.send("Parcel Added");
    }
  );
});

// DELETE parcel
app.delete("/parcels/:id", (req, res) => {
const id = req.params.id;

db.query(
"DELETE FROM parcels WHERE id = ?",
[id],
(err, result) => {
if (err) return res.send(err);
res.send("Deleted");
}
);
});

// UPDATE parcel (UPDATED)
// UPDATE parcel
app.put("/parcels/:id", (req, res) => {

  const id = req.params.id;

  const {

    lr_number,
    customer_name,
    customer_phone,
    from_location,
    to_location,
    current_location,
    weight,
    vehicle,
    total_amount,
    advance_paid,
    balance,
    payment_status,
    status,
    expected_delivery,
    description,
    remarks

  } = req.body;

  db.query(

    `UPDATE parcels SET

      lr_number=?,
      customer_name=?,
      customer_phone=?,
      from_location=?,
      to_location=?,
      current_location=?,
      weight=?,
      vehicle=?,
      total_amount=?,
      advance_paid=?,
      balance=?,
      payment_status=?,
      status=?,
      expected_delivery=?,
      description=?,
      remarks=?

    WHERE id=?`,

    [
      lr_number,
      customer_name,
      customer_phone,
      from_location,
      to_location,
      current_location,
      weight,
      vehicle,
      total_amount,
      advance_paid,
      balance,
      payment_status,
      status,
      expected_delivery,
      description,
      remarks,
      id
    ],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.send(err);
      }

      res.send("Parcel Updated");
    }
  );
});

// ================= INVOICES =================

// GET invoices
app.get("/invoices", (req, res) => {
db.query(
"SELECT * FROM invoices ORDER BY created_at DESC",
(err, result) => {
if (err) return res.send(err);
res.send(result);
}
);
});

// CREATE invoice
app.post("/invoices", (req, res) => {

const {
invoice_number,
invoice_type,
customer_name,
customer_phone,
customer_address,
lr_number,
items,
subtotal,
gst_percent,
gst_amount,
total_amount,
notes
} = req.body;

db.query(
`INSERT INTO invoices
    (
      invoice_number,
      invoice_type,
      customer_name,
      customer_phone,
      customer_address,
      lr_number,
      items,
      subtotal,
      gst_percent,
      gst_amount,
      total_amount,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
[
invoice_number,
invoice_type,
customer_name,
customer_phone,
customer_address,
lr_number,
JSON.stringify(items),
subtotal,
gst_percent,
gst_amount,
total_amount,
notes
],
(err, result) => {
if (err) return res.send(err);
res.send("Invoice Created");
}
);
});

// DELETE invoice
app.delete("/invoices/:id", (req, res) => {

const id = req.params.id;

db.query(
"DELETE FROM invoices WHERE id = ?",
[id],
(err, result) => {
if (err) return res.send(err);
res.send("Deleted");
}
);
});

// ================= FINANCE =================

// GET income
app.get("/income", (req, res) => {

  db.query(

    "SELECT * FROM income ORDER BY date DESC",

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// ADD income
app.post("/income", (req, res) => {

  const {

    client_name,
    lr_number,
    amount,
    payment_mode,
    description,
    date

  } = req.body;

  db.query(

    `INSERT INTO income
    (
      client_name,
      lr_number,
      amount,
      payment_mode,
      description,
      date
    )

    VALUES (?, ?, ?, ?, ?, ?)`,

    [
      client_name,
      lr_number,
      amount,
      payment_mode,
      description,
      date
    ],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Income Added");
    }
  );
});

// GET expenditure
app.get("/expenditure", (req, res) => {

  db.query(

    "SELECT * FROM expenditure ORDER BY date DESC",

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// ADD expenditure
app.post("/expenditure", (req, res) => {

  const {

    category,
    amount,
    description,
    vehicle_number,
    date

  } = req.body;

  db.query(

    `INSERT INTO expenditure
    (
      category,
      amount,
      description,
      vehicle_number,
      date
    )

    VALUES (?, ?, ?, ?, ?)`,

    [
      category,
      amount,
      description,
      vehicle_number,
      date
    ],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Expense Added");
    }
  );
});

// ================= REPORTS =================

// Parcel Report
app.get("/report/parcels", (req, res) => {

  db.query(

    `SELECT
      lr_number,
      customer_name,
      customer_phone,
      from_location,
      to_location,
      status,
      total_amount,
      balance,
      payment_status,
      created_at

    FROM parcels

    ORDER BY created_at DESC`,

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// Delivered Report
app.get("/report/delivered", (req, res) => {

  db.query(

    `SELECT
      lr_number,
      customer_name,
      from_location,
      to_location,
      total_amount,
      payment_status,
      updated_at

    FROM parcels

    WHERE status='Delivered'

    ORDER BY updated_at DESC`,

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// Pending Balance
app.get("/report/pending", (req, res) => {

  db.query(

    `SELECT
      lr_number,
      customer_name,
      customer_phone,
      total_amount,
      advance_paid,
      balance,
      payment_status

    FROM parcels

    WHERE payment_status!='Paid'

    ORDER BY created_at DESC`,

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// Customer Report
app.get("/report/customers", (req, res) => {

  db.query(

    `SELECT
      name,
      phone,
      email,
      category,
      address,
      created_at

    FROM customers

    ORDER BY name ASC`,

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// Profit Loss Report
app.get("/report/profit-loss", async (req, res) => {

  db.query(

    "SELECT amount FROM income",

    (err, incomeRows) => {

      if (err) return res.send(err);

      db.query(

        "SELECT amount FROM expenditure",

        (err2, expenseRows) => {

          if (err2) return res.send(err2);

          const incTotal =
            incomeRows.reduce(
              (s, i) => s + Number(i.amount),
              0
            );

          const expTotal =
            expenseRows.reduce(
              (s, e) => s + Number(e.amount),
              0
            );

          res.send([
            {
              type: "Total Income",
              amount: incTotal
            },
            {
              type: "Total Expense",
              amount: expTotal
            },
            {
              type: "Net Profit",
              amount: incTotal - expTotal
            }
          ]);
        }
      );
    }
  );
});

// ================= VEHICLES =================

// GET vehicles
app.get("/vehicles", (req, res) => {

  db.query(

    "SELECT * FROM vehicles ORDER BY created_at DESC",

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// ADD vehicle
app.post("/vehicles", (req, res) => {

  const {

    vehicle_number,
    vehicle_type,
    driver_name,
    driver_phone,
    is_active

  } = req.body;

  db.query(

    `INSERT INTO vehicles
    (
      vehicle_number,
      vehicle_type,
      driver_name,
      driver_phone,
      is_active
    )

    VALUES (?, ?, ?, ?, ?)`,

    [
      vehicle_number,
      vehicle_type,
      driver_name,
      driver_phone,
      is_active
    ],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Vehicle Added");
    }
  );
});

// UPDATE vehicle
app.put("/vehicles/:id", (req, res) => {

  const id = req.params.id;

  const {

    vehicle_number,
    vehicle_type,
    driver_name,
    driver_phone,
    is_active

  } = req.body;

  db.query(

    `UPDATE vehicles SET

      vehicle_number=?,
      vehicle_type=?,
      driver_name=?,
      driver_phone=?,
      is_active=?

    WHERE id=?`,

    [
      vehicle_number,
      vehicle_type,
      driver_name,
      driver_phone,
      is_active,
      id
    ],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Updated");
    }
  );
});

// DELETE vehicle
app.delete("/vehicles/:id", (req, res) => {

  const id = req.params.id;

  db.query(

    "DELETE FROM vehicles WHERE id=?",

    [id],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Deleted");
    }
  );
});

// ================= CONTACT SUBMISSIONS =================

// GET all submissions
app.get("/contact-submissions", (req, res) => {

  db.query(

    `SELECT *
     FROM contact_submissions
     ORDER BY created_at DESC`,

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// ADD contact submission
app.post("/contact-submissions", (req, res) => {

  const {

    name,
    phone,
    email,
    message

  } = req.body;

  db.query(

    `INSERT INTO contact_submissions
    (
      name,
      phone,
      email,
      message
    )

    VALUES (?, ?, ?, ?)`,

    [
      name,
      phone,
      email,
      message
    ],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Submitted");
    }
  );
});

// UPDATE read status
app.put("/contact-submissions/:id", (req, res) => {

  const id = req.params.id;

  const { is_read } = req.body;

  db.query(

    `UPDATE contact_submissions
     SET is_read=?
     WHERE id=?`,

    [is_read, id],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Updated");
    }
  );
});

// DELETE submission
app.delete("/contact-submissions/:id", (req, res) => {

  const id = req.params.id;

  db.query(

    "DELETE FROM contact_submissions WHERE id=?",

    [id],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Deleted");
    }
  );
});

// ================= ADMINS =================

// GET admins
app.get("/admins", (req, res) => {

  db.query(

    `SELECT *
     FROM admins
     ORDER BY created_at DESC`,

    (err, result) => {

      if (err) return res.send(err);

      res.send(result);
    }
  );
});

// ADD admin
app.post("/admins", (req, res) => {

  const {

    email,
    password,
    role

  } = req.body;

  db.query(

    `INSERT INTO admins
    (
      email,
      password,
      role
    )

    VALUES (?, ?, ?)`,

    [
      email,
      password,
      role
    ],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Admin Added");
    }
  );
});

// DELETE admin
app.delete("/admins/:id", (req, res) => {

  const id = req.params.id;

  db.query(

    "DELETE FROM admins WHERE id=?",

    [id],

    (err, result) => {

      if (err) return res.send(err);

      res.send("Deleted");
    }
  );
});

// ================= DASHBOARD =================

// parcels
app.get("/dashboard/parcels", (req, res) => {

  db.query(

    `SELECT
      status,
      payment_status,
      balance
     FROM parcels`,

    (err, result) => {

      if (err) {

        console.log(err);

        return res.send(err);
      }

      res.send(result);
    }
  );
});

// income
app.get("/dashboard/income", (req, res) => {

  db.query(

    "SELECT amount, date FROM income",

    (err, result) => {

      if (err) {

        console.log(err);

        return res.send(err);
      }

      res.send(result);
    }
  );
});

// expense
app.get("/dashboard/expense", (req, res) => {

  db.query(

    "SELECT amount, date FROM expenditure",

    (err, result) => {

      if (err) {

        console.log(err);

        return res.send(err);
      }

      res.send(result);
    }
  );
});

// activity
app.get("/dashboard/activity", (req, res) => {

  db.query(

    `SELECT
      action,
      created_at
     FROM activity_logs
     ORDER BY created_at DESC
     LIMIT 5`,

    (err, result) => {

      if (err) {

        console.log(err);

        return res.send(err);
      }

      res.send(result);
    }
  );
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT id, email, role, full_name FROM admins WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.json({ user: result[0] });
    }
  );
});

// ================= PUBLIC TRACKING =================
app.get("/track", (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  const trimmed = query.trim();
  db.query(
    "SELECT * FROM parcels WHERE lr_number = ? OR customer_phone = ? LIMIT 1",
    [trimmed, trimmed],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      if (result.length === 0) {
        return res.json(null);
      }
      res.json(result[0]);
    }
  );
});

// ================= START SERVER =================
app.listen(5000, () => {
console.log("Server running on port 5000");
});
