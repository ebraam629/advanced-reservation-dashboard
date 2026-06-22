-- 1. إنشاء جدول المستخدمين
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL
);

-- 2. إنشاء جدول الحجوزات وربطه بالمستخدم
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) DEFAULT 'كشف طبي',
  price DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'Pending',
  date VARCHAR(50) NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);