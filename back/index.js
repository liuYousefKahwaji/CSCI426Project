const express = require('express');
const cors = require('cors')
const mysql = require('mysql')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
const upload = multer();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb)=> {
    const name = `profile_${req.params.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, name);
  }
});
const uploadSingle = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stockex"
});

db.connect(err => {
  if (err) {
    console.log("DB ERROR: ", err);
    return;
  }
  console.log("MySQL connected.");
});


//stocks fetch
app.get("/stocks", (req, res) => {
  db.query("SELECT * FROM stocks", (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
});

//holdings fetch
app.get("/holdings", (req, res) => {
  db.query("SELECT holding_id,users.id,stocks.company, stocks.ticker, holdings.quantity, stocks.price from holdings,stocks,users where stocks.ticker=holdings.stock_ticker and users.id=holdings.user_id;", (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
});

//users fetch
app.get("/userlist", (req, res) => {
  db.query("SELECT * FROM users", (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
});

//users delete
app.delete("/userlist/:id", (req, res) => {
  const userId = req.params.id;
  db.query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User deleted!" });
    }
  );
});

//holdings delete
app.delete("/holdings/:holding_id", (req, res) => {
  const holdingId = req.params.holding_id;
  db.query(
    "DELETE FROM holdings WHERE holding_id = ?",
    [holdingId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Holding deleted!" });
    }
  );
});

//users insert
app.post("/userlist", upload.none(), (req, res) => {
  const name = req.body.name;
  const pass = req.body.pass;
  db.query(
    "INSERT INTO users (name, pass, admin, wallet) VALUES (?, ?, 0, 0)",
    [name, pass],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User inserted!" });
    }
  );
});

//holdings insert
app.post("/holdings", upload.none(), (req, res) => {
  const values = [
    req.body.user_id,
    req.body.stock_ticker,
    req.body.quantity,
  ];
  db.query(
    "INSERT INTO holdings (user_id, stock_ticker, quantity) VALUES (?, ?, ?)",
    values,
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Holding inserted!" });
    }
  );
});

//users update
app.put("/userlist/:id", (req, res) => {
  const id = req.params.id;
  const q = "UPDATE users SET name= ?, pass= ?, admin= ?, wallet= ?, profile = ? WHERE id = ?";

  const values = [
    req.body.name,
    req.body.pass,
    req.body.admin,
    req.body.wallet,
    req.body.profile ?? null,
  ];

  db.query(q, [...values, id], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//profile image upload
app.post('/userlist/:id/profile', uploadSingle.single('profile'), (req, res) => {
  const id = req.params.id;
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const profilePath = `/uploads/${req.file.filename}`;
  const q = 'UPDATE users SET profile = ? WHERE id = ?';
  db.query(q, [profilePath, id], (err, data) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({ message: 'Profile uploaded', profile: profilePath });
  });
});

//holdings update
app.put("/holdings/:id",upload.none(),(req, res) => {
  const id = req.params.id;
  const quantity = req.body.quantity;
  const q = "UPDATE holdings SET quantity= ? WHERE holding_id = ?";
  db.query(q, [quantity, id], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//transactions fetch
app.get("/transactions", (req, res) => {
  const userId = req.query.user_id;
  let q = "SELECT transaction_id, users.id as user_id, users.name, transactions.ticker, transactions.transaction_type, transactions.quantity, transactions.price, transactions.timestamp FROM transactions, users WHERE transactions.user_id = users.id";
  if (userId) {
    q += " AND transactions.user_id = ?";
    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json({ error: err });
      res.json(data);
    });
  } else {
    db.query(q, (err, data) => {
      if (err) return res.status(500).json({ error: err });
      res.json(data);
    });
  }
});

//transactions insert
app.post("/transactions", upload.none(), (req, res) => {
  const values = [
    req.body.user_id,
    req.body.ticker,
    req.body.transaction_type,
    req.body.quantity,
    req.body.price,
  ];
  db.query(
    "INSERT INTO transactions (user_id, ticker, transaction_type, quantity, price) VALUES (?, ?, ?, ?, ?)",
    values,
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Transaction inserted!" });
    }
  );
});

//requests fetch
app.get("/requests", (req, res) => {
  const userId = req.query.user_id;
  let q = "SELECT requests.id, requests.user_id, users.name as user_name, requests.name, requests.type, requests.stock_ticker, requests.new_price, requests.time FROM requests, users WHERE requests.user_id = users.id";
  if (userId) {
    q += " AND requests.user_id = ?";
    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json({ error: err });
      res.json(data);
    });
  } else {
    db.query(q, (err, data) => {
      if (err) return res.status(500).json({ error: err });
      res.json(data);
    });
  }
});

//requests insert
app.post("/requests", upload.none(), (req, res) => {
  const values = [
    req.body.user_id,
    req.body.name,
    req.body.type,
    req.body.stock_ticker || null,
    req.body.new_price || null,
  ];
  db.query(
    "INSERT INTO requests (user_id, name, type, stock_ticker, new_price) VALUES (?, ?, ?, ?, ?)",
    values,
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Request inserted!" });
    }
  );
});

//requests delete
app.delete("/requests/:id", (req, res) => {
  const requestId = req.params.id;
  db.query(
    "DELETE FROM requests WHERE id = ?",
    [requestId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Request deleted!" });
    }
  );
});

//stocks insert
app.post("/stocks", upload.none(), (req, res) => {
  const company = req.body.company;
  const ticker = req.body.ticker ? req.body.ticker.toUpperCase() : null;
  const price = parseFloat(req.body.price);
  
  if (!company || !ticker || !price || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }
  
  const values = [
    company,
    ticker,
    price,
    0, // change is always 0 for new stocks
  ];
  db.query(
    "INSERT INTO stocks (company, ticker, price, `change`) VALUES (?, ?, ?, ?)",
    values,
    (err, result) => {
      if (err) {
        console.log("Stock insert error:", err);
        if (err.code === 'ER_DUP_ENTRY' || err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Stock with this ticker already exists" });
        }
        const errorMessage = err.message || err.sqlMessage || "Failed to insert stock";
        return res.status(500).json({ error: errorMessage });
      }
      res.json({ message: "Stock inserted!" });
    }
  );
});

//stocks update price
app.put("/stocks/:ticker", upload.none(), (req, res) => {
  const ticker = req.params.ticker;
  const newPrice = parseFloat(req.body.price);
  
  // Get old price first
  db.query("SELECT price FROM stocks WHERE ticker = ?", [ticker], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ error: "Stock not found" });
    
    const oldPrice = result[0].price;
    const change = newPrice - oldPrice;
    
    db.query(
      "UPDATE stocks SET price = ?, `change` = ? WHERE ticker = ?",
      [newPrice, change, ticker],
      (err, updateResult) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Stock price updated!" });
      }
    );
  });
});

app.listen(5000, () => {
    console.log("Connected to the backend.");
});