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
    street TEXT,
    number TEXT,
    city TEXT,
    neighborhood TEXT,
    state TEXT,
    cep TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )
`).run();


const adminExists = db.prepare(`SELECT * FROM users WHERE email = ?`).get('admin@admin.com');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('teste123', 10);
  db.prepare(`
    INSERT INTO users (name, lastName, cpf, street, number,neighborhood, city, state, cep, email, password, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Admin', 
    'User', 
    '00000000000', 
    'Av. Paulista', 
    '1000', 
    'Centro',
    'São Paulo', 
    'SP', 
    '01000-000', 
    'admin@admin.com', 
    hashedPassword, 
    'ADMIN'
  );
}


const userExists = db.prepare(`SELECT * FROM users WHERE email = ?`).get('user@user.com');
if (!userExists) {
  const hashedPassword = bcrypt.hashSync('teste123', 10);
  db.prepare(`
    INSERT INTO users (name, lastName, cpf, street, number,neighborhood, city, state, cep, email, password, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `).run(
    'Comprador', 
    'User', 
    '11111111111', 
    'Rua das Flores', 
    '200', 
    'Centro',
    'Rio de Janeiro', 
    'RJ', 
    '20000-000', 
    'user@user.com', 
    hashedPassword, 
    'USER'
  );
}

db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    scent TEXT NOT NULL,
    imageUrl TEXT,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    price REAL NOT NULL
  )
`).run();
const row = db.prepare(`SELECT COUNT(*) as count FROM products`).get() as { count: number };
const productCount = row.count;
if (productCount === 0) {
  const insert = db.prepare(`
      INSERT INTO products (name, description, scent, type, size, price, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

  insert.run("Vela Aromática Lavanda", "Vela aromática com essência de lavanda", "Lavanda", "VELA", "200G", 89.00, '/uploads/vela.jpg');
  insert.run("Difusor de Ambiente Baunilha", "Difusor de ambiente com essência de baunilha", "Baunilha", "DIFUSOR", "250ML", 89.00, '/uploads/difusor.jpg');
  insert.run("Home Spray Rosas", "Spray para ambientes com fragrância de rosas", "Rosas", "HOME_SPRAY", "500ML", 79.00, '/uploads/homespray.jpg');
  insert.run("Vela Aromática de Baunilha", "Vela aromática com essência de baunulha", "Baunilha", "ESSENCIA", "100G", 69.00, '/uploads/vela1.jpg');
  insert.run("Vela Aromática Cítrica", "Vela com fragrância cítrica refrescante", "Cítrica", "VELA", "100G", 69.00, '/uploads/vela2.jpg');
}

db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    order_data TEXT NOT NULL,
    total DOUBLE,
    payment_method TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES users(id)
  )
`).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS order_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    value DOUBLE not null,
    quantity INTEGER not null,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`).run();

const orderCount = db.prepare(`SELECT COUNT(*) as count FROM orders`).get() as { count: number };

if (orderCount.count === 0) {
  const user = db.prepare(`SELECT id FROM users WHERE email = ?`).get('user@user.com') as { id: number } | undefined;
  const userId = user?.id;


  const products = db.prepare(`SELECT id, price FROM products`).all() as { id: number; price: number }[];

  if (userId && products.length > 0) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (client_id, order_data, total, payment_method)
      VALUES (?, datetime('now'), ?, ?)
    `);

    const insertOrderItem = db.prepare(`
      INSERT INTO order_item (product_id, order_id, value, quantity)
      VALUES (?, ?, ?, ?)
    `);




    const numItems = Math.min(3, products.length);
    const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, numItems);


    const total = selectedProducts.reduce((acc, p) => {
      const qty = Math.floor(Math.random() * 3) + 1; // quantidade 1 a 3
      return acc + p.price * qty;
    }, 0);


    const info = insertOrder.run(userId, total, 'CREDIT_CARD');
    const orderId = info.lastInsertRowid as number;


    for (const product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 3) + 1;
      insertOrderItem.run(product.id, orderId, product.price, quantity);
    }

  }
}


export default db;
