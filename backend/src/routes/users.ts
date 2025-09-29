import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não definido no .env');
}


const router = Router();

interface User {
    id: number;
    name: string;
    lastName: string;
    cpf: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'USER';
}


function validateUserPayload(body: any, requireRole = false) {
    const {
        name,
        cpf,
        email,
        password,
        confirmPassword,
        number,
        street,
        neighborhood,
        city,
        state,
        cep,
        role, // só se for admin
    } = body;

    const requiredFields = [
        name,
        cpf,
        email,
        password,
        confirmPassword,
        number,
        street,
        neighborhood,
        city,
        state,
        cep,
    ];

    if (requiredFields.some((field) => !field || String(field).trim() === '')) {
        return { valid: false, message: 'Todos os campos obrigatórios devem ser preenchidos' };
    }

    if (password !== confirmPassword) {
        return { valid: false, message: 'As senhas não coincidem' };
    }

    if (requireRole && (!role || role.trim() === '')) {
        return { valid: false, message: 'Campo role é obrigatório para criação de usuário admin' };
    }

    return { valid: true };
}

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = db
        .prepare(`SELECT * FROM users WHERE email = ? or cpf =?`)
        .get(username, username) as User | undefined;

    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Senha inválida' });

    const token = jwt.sign(
        { id: user.id, cpf: user.cpf, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});
router.post('/me/novo', (req, res) => {
    const validation = validateUserPayload(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const {
        name,
        lastName,
        cpf,
        street,
        number,
        neighborhood,
        city,
        state,
        cep,
        email,
        password,
    } = req.body;

    const existingUser = db
        .prepare(`SELECT * FROM users WHERE email = ? OR cpf = ?`)
        .get(email, cpf) as User | undefined;

    if (existingUser) {
        return res.status(409).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const role: 'USER' = 'USER';

    const result = db
        .prepare(
            `
    INSERT INTO users 
    (name, lastName, cpf, street, number, neighborhood, city, state, cep, email, password, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
        )
        .run(
            name,
            lastName || '',
            cpf,
            street,
            number,
            neighborhood,
            city,
            state,
            cep,
            email,
            hashedPassword,
            role
        );

    res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
            id: result.lastInsertRowid,
            name,
            lastName,
            cpf,
            street,
            number,
            neighborhood,
            city,
            state,
            cep,
            email,
            role,
        },
    });
});


router.post('/', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const validation = validateUserPayload(req.body, true);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const {
        name,
        lastName,
        cpf,
        street,
        number,
        neighborhood,
        city,
        state,
        cep,
        email,
        password,
        role,
    } = req.body;

    const existingUser = db
        .prepare(`SELECT * FROM users WHERE email = ? OR cpf = ?`)
        .get(email, cpf) as User | undefined;

    if (existingUser) {
        return res.status(409).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = db
        .prepare(
            `
    INSERT INTO users 
    (name, lastName, cpf, street, number, neighborhood, city, state, cep, email, password, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
        )
        .run(
            name,
            lastName || '',
            cpf,
            street,
            number,
            neighborhood,
            city,
            state,
            cep,
            email,
            hashedPassword,
            role
        );

    res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
            id: result.lastInsertRowid,
            name,
            lastName,
            cpf,
            street,
            number,
            neighborhood,
            city,
            state,
            cep,
            email,
            role,
        },
    });
});
router.get('/', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const users = db
        .prepare(
            `SELECT id, name, lastName, cpf, street, number, neighborhood, city, state, cep, email, role FROM users`
        )
        .all() as User[];
    res.json(users);
});
router.put('/:id', authenticateJWT, (req, res) => {


    const  body  = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID do usuário é obrigatório' });
    }

    const existingUser = db
        .prepare(`SELECT * FROM users WHERE id = ?`)
        .get(id) as User | undefined;

    if (!existingUser) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }


    const validation = validateUserPayload(body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const hashedPassword = body.password
        ? bcrypt.hashSync(body.password, 10)
        : existingUser.password;

    db.prepare(
        `
    UPDATE users
    SET name = ?, lastName = ?, street = ?, number = ?, neighborhood = ?, city = ?, state = ?, cep = ?, email = ?, password = ?
    WHERE id = ?
  `
    ).run(
        body.name || existingUser.name,
        body.lastName || existingUser.lastName,
        body.street || existingUser.street,
        body.number || existingUser.number,
        body.neighborhood || existingUser.neighborhood,
        body.city || existingUser.city,
        body.state || existingUser.state,
        body.cep || existingUser.cep,
        body.email || existingUser.email,
        hashedPassword,
        id
    );

    const updatedUser = db
        .prepare(
            `SELECT id, name, lastName, cpf, street, number, neighborhood, city, state, cep, email, role FROM users WHERE id = ?`
        )
        .get(id);

    res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
});

router.get('/:id', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const { id } = req.params;

    const user = db
        .prepare(
            `
      SELECT id, name, lastName, cpf, street, number, neighborhood, city, state, cep, email, role
      FROM users WHERE id = ?
    `
        )
        .get(id) as User | undefined;

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json(user);
});
router.get('/completo/:id', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const { id } = req.params;

    const user = db
        .prepare(
            `
      SELECT id, name, lastName, cpf, street, number, neighborhood, city, state, cep, email, role
      FROM users WHERE id = ?
    `
        )
        .get(id) as User | undefined;

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json(user);
});
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const { id } = req.params;

    const existingUser = db
        .prepare(`SELECT * FROM users WHERE id = ?`)
        .get(id) as User | undefined;
    if (!existingUser)
        return res.status(404).json({ message: 'Usuário não encontrado' });

    db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
    res.json({ message: 'Usuário deletado com sucesso' });
});
router.get('/', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    const users = db.prepare(`SELECT id, name, lastName, cpf, email, role FROM users`).all();
    res.json(users);
});
router.get('/dados/me', authenticateJWT, (req, res) => {
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    const user = db.prepare(
        `SELECT id, name, lastName, cpf, street, number, neighborhood, city, state, cep, email, role FROM users WHERE id = ?`
    ).get(userId);

    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
});

export default router;
