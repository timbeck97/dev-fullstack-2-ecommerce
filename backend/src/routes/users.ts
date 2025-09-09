// routes/users.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import db from '../config/db';
import User from '../types/user';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não definido no .env');
}

const router = express.Router();
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = db
        .prepare(`SELECT * FROM users WHERE username = ?`)
        .get(username) as User | undefined;
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Senha inválida' });

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});
router.post('/register', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const {
        name,
        lastName,
        cpf,
        birthDate,
        address,
        number,
        email,
        username,
        password,
        role
    } = req.body;


    if (!name || !lastName || !cpf || !email || !username || !password || !role) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }


    const existingUser = db.prepare(`SELECT * FROM users WHERE username = ? OR email = ? OR cpf = ?`)
        .get(username, email, cpf);
    if (existingUser) return res.status(409).json({ message: 'Usuário já existe' });


    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = db.prepare(`
      INSERT INTO users (name, lastName, cpf, birthDate, address, number, email, username, password, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, lastName, cpf, birthDate, address, number, email, username, hashedPassword, role);

    res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
            id: result.lastInsertRowid,
            name,
            lastName,
            cpf,
            birthDate,
            address,
            number,
            email,
            username,
            role
        }
    });
});
router.post('/register-client', (req, res) => {
    const {
        name,
        lastName,
        cpf,
        birthDate,
        address,
        number,
        email,
        username,
        password
    } = req.body;


    if (!name || !lastName || !cpf || !email || !username || !password) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }


    const existingUser = db.prepare(`
        SELECT * FROM users WHERE username = ? OR email = ? OR cpf = ?
    `).get(username, email, cpf) as User | undefined;

    if (existingUser) return res.status(409).json({ message: 'Usuário já existe' });


    const hashedPassword = bcrypt.hashSync(password, 10);


    const role: 'USER' = 'USER';

    const result = db.prepare(`
      INSERT INTO users (name, lastName, cpf, birthDate, address, number, email, username, password, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, lastName, cpf, birthDate, address, number, email, username, hashedPassword, role);

    res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
            id: result.lastInsertRowid,
            name,
            lastName,
            cpf,
            birthDate,
            address,
            number,
            email,
            username,
            role
        }
    });
});
router.get('/', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const users = db.prepare(`
    SELECT id, name, lastName, cpf, birthDate, address, number, email, username, role 
    FROM users
`).all() as User[];
    res.json(users);
});
router.get('/:id', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const { id } = req.params;
    const user = db.prepare(`
        SELECT id, name, lastName, cpf, birthDate, address, number, email, username, role 
        FROM users 
        WHERE id = ?
    `).get(id) as User | undefined;

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
});
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const { id } = req.params;

    const existingUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as User | undefined;
    if (!existingUser) return res.status(404).json({ message: 'Usuário não encontrado' });

    db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
    res.json({ message: 'Usuário deletado com sucesso' });
});
router.put('/:id', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const { id } = req.params;
    const {
        name,
        lastName,
        cpf,
        birthDate,
        address,
        number,
        email,
        username,
        password,
        role
    } = req.body;

    const existingUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as User | undefined;
    if (!existingUser) return res.status(404).json({ message: 'Usuário não encontrado' });

    const hashedPassword = password ? bcrypt.hashSync(password, 10) : existingUser.password;

    db.prepare(`
        UPDATE users
        SET name = ?, lastName = ?, cpf = ?, birthDate = ?, address = ?, number = ?, email = ?, username = ?, password = ?, role = ?
        WHERE id = ?
    `).run(
        name || existingUser.name,
        lastName || existingUser.lastName,
        cpf || existingUser.cpf,
        birthDate || existingUser.birthDate,
        address || existingUser.address,
        number || existingUser.number,
        email || existingUser.email,
        username || existingUser.username,
        hashedPassword,
        role || existingUser.role,
        id
    );

    const updatedUser = db.prepare(`
        SELECT id, name, lastName, cpf, birthDate, address, number, email, username, role 
        FROM users 
        WHERE id = ?
    `).get(id) as User;

    res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
});

export default router;
