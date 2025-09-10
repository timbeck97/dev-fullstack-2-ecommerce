// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não definido no .env');
}

interface JwtPayload {
    id: number;
    cpf: string;
    role: 'ADMIN' | 'USER';
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (req as any).user = payload; 
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};


export const authorizeRoles = (...roles: ('ADMIN' | 'USER')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        next();
    };
};
