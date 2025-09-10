// db.ts
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';


const db = new Database('ecommerce.db');


db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lastName TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    birthDate TEXT,
    address TEXT,
    number TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )
`).run();


const adminExists = db.prepare(`SELECT * FROM users WHERE email = ?`).get('admin@admin.com');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('teste123', 10);
  db.prepare(`
      INSERT INTO users (name, lastName, cpf, email, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('Admin', 'User', '00000000000', 'admin@admin.com', hashedPassword, 'ADMIN');
}
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    scent TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    price REAL NOT NULL
  )
`).run();
const row = db.prepare(`SELECT COUNT(*) as count FROM products`).get() as { count: number };
const productCount = row.count; if (productCount === 0) {
  const insert = db.prepare(`
      INSERT INTO products (name, description, scent, type, size, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

  insert.run("Vela Aromática Lavanda", "Vela aromática com essência de lavanda", "Lavanda", "VELA", "200G", 29.90);
  insert.run("Difusor de Ambiente Baunilha", "Difusor de ambiente com essência de baunilha", "Baunilha", "DIFUSOR", "250ML", 49.90);
  insert.run("Home Spray Rosas", "Spray para ambientes com fragrância de rosas", "Rosas", "HOME_SPRAY", "500ML", 39.90);
  insert.run("Essência de Jasmim", "Essência concentrada para aromatizadores", "Jasmim", "ESSENCIA", "45ML", 19.90);
  insert.run("Vela Aromática Cítrica", "Vela com fragrância cítrica refrescante", "Cítrica", "VELA", "100G", 24.90);
}



export default db;
