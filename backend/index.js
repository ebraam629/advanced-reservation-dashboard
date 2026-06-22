/* eslint-disable */
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "*" }));
app.use(express.json());

const sqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, "clinic.db");
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ فشل الاتصال بقاعدة البيانات:", err.message);
  } else {
    console.log("DataBase Connected");
    bootstrapDatabase();
  }
});

function bootstrapDatabase() {
  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        name TEXT
      )
    `,
      (err) => {
        if (!err) {
          const insertUserStmt = db.prepare(`
          INSERT OR IGNORE INTO users (id, username, password, name) 
          VALUES (1, 'test@gmail.com', '123456', 'د. إبرام')
        `);
          insertUserStmt.run();
          insertUserStmt.finalize();
        }
      },
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT NOT NULL,
        title TEXT DEFAULT 'كشف طبي',
        price REAL DEFAULT 0,
        status TEXT DEFAULT 'Pending',
        date TEXT,
        user_id INTEGER
      )
    `,
      (err) => {
        if (!err) {
          db.run(
            `ALTER TABLE reservations ADD COLUMN user_id INTEGER`,
            () => {},
          );
        }
      },
    );
  });
}
// Endpoint لتغيير كلمة المرور
app.put("/api/users/:id/change-password", async (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    // 1. ابحث عن المستخدم في قاعدة البيانات (عدل السطر ده حسب الداتا بيز بتاعتك)
    // مثال لو شغال بـ SQL (MySQL/PostgreSQL):
    // const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    // const user = users[0];

    // بافتراض إنك لقيت المستخدم وجبته في متغير اسمه user:
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود!" });
    }

    // 2. التأكد من كلمة المرور القديمة
    // لو بتستخدم bcrypt لتشفير الباسورد:
    // const isMatch = await bcrypt.compare(oldPassword, user.password);

    // لو بتخزن الباسورد نص صريح (أو مقارنة عادية):
    const isMatch = oldPassword === user.password;

    if (!isMatch) {
      return res.status(400).json({
        message:
          req.headers["accept-language"] === "ar"
            ? "كلمة المرور القديمة غير صحيحة!"
            : "Incorrect old password!",
      });
    }

    // 3. تحديث كلمة المرور الجديدة في قاعدة البيانات
    // لو بتشفر الباسورد الجديد: const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // أمر التحديث في قاعدة البيانات (عدله حسب نوع الداتا بيز عندك):
    // await db.execute('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);

    return res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "حدث خطأ في السيرفر!" });
  }
});

// API تسجيل الدخول
app.post("/api/auth/signin", (req, res) => {
  const username = req.body.username || req.body.email;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "من فضلك أدخل البريد وكلمة المرور" });
  }

  db.get(
    "SELECT id, username, name FROM users WHERE username = ? AND password = ?",
    [username.trim(), password.trim()],
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: "البيانات غير صحيحة" });
      }
      return res.json({ user });
    },
  );
});

// API إنشاء حساب
app.post("/api/auth/signup", (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ message: "من فضلك املأ جميع الخانات" });
  }

  db.run(
    "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
    [name.trim(), username.trim(), password.trim()],
    function (err) {
      if (err) return res.status(400).json({ message: "مسجل بالفعل!" });
      return res
        .status(201)
        .json({ user: { id: this.lastID, name, username } });
    },
  );
});

// 🌟 [جديد] API تحديث اسم المستخدم
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "الاسم لا يمكن أن يكون فارغاً" });
  }

  db.run(
    "UPDATE users SET name = ? WHERE id = ?",
    [name.trim(), id],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      if (this.changes === 0)
        return res.status(404).json({ message: "المستخدم غير موجود" });

      return res.json({ message: "success" });
    },
  );
});

// 🌟 [جديد] API تغيير كلمة المرور
app.put("/api/users/:id/change-password", (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "برجاء إدخال كلمة المرور القديمة والجديدة" });
  }

  // التأكد من أن كلمة المرور القديمة صحيحة أولاً
  db.get("SELECT password FROM users WHERE id = ?", [id], (err, row) => {
    if (err || !row)
      return res.status(404).json({ message: "المستخدم غير موجود" });

    if (row.password !== oldPassword.trim()) {
      return res
        .status(400)
        .json({ message: "كلمة المرور القديمة غير صحيحة!" });
    }

    // التحديث للجديدة
    db.run(
      "UPDATE users SET password = ? WHERE id = ?",
      [newPassword.trim(), id],
      function (err) {
        if (err) return res.status(500).json({ message: err.message });
        return res.json({ message: "success" });
      },
    );
  });
});

// جلب الحجوزات
app.get("/api/reservations", (req, res) => {
  const userId = req.headers["user-id"];
  db.all(
    "SELECT * FROM reservations WHERE user_id = ? ORDER BY id DESC",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    },
  );
});

// إضافة حجز جديد
app.post("/api/reservations", (req, res) => {
  const { client_name, title, price, status, date, user_id } = req.body;
  db.run(
    "INSERT INTO reservations (client_name, title, price, status, date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
    [client_name, title, price, status, date, user_id],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ id: this.lastID });
    },
  );
});

// تعديل حجز مرن وآمن تماماً
app.put("/api/reservations/:id", (req, res) => {
  const { id } = req.params;
  const { client_name, title, price, status, date, user_id } = req.body;

  db.get(
    "SELECT * FROM reservations WHERE id = ? AND user_id = ?",
    [id, user_id],
    (err, row) => {
      if (err || !row) return res.status(404).json({ message: "غير موجود" });

      const fName = client_name !== undefined ? client_name : row.client_name;
      const fTitle = title !== undefined ? title : row.title;
      const fPrice = price !== undefined ? price : row.price;
      const fStatus = status !== undefined ? status : row.status;
      const fDate = date !== undefined ? date : row.date;

      db.run(
        "UPDATE reservations SET client_name = ?, title = ?, price = ?, status = ?, date = ? WHERE id = ? AND user_id = ?",
        [fName, fTitle, fPrice, fStatus, fDate, id, user_id],
        function (err) {
          if (err) return res.status(500).json({ message: err.message });
          res.json({ message: "success" });
        },
      );
    },
  );
});

// حذف حجز
app.delete("/api/reservations/:id", (req, res) => {
  db.run(
    "DELETE FROM reservations WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ deleted: this.changes });
    },
  );
});

app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
