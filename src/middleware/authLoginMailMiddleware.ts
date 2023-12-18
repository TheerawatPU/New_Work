// userController.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import prisma from '../lib/db';
import jwt from 'jsonwebtoken';

const authLoginMailMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const CheckHeader = req.headers.authorization;

    if (!CheckHeader) {
        return res.status(404).json({ message: 'Is Not Token.' });
    }

    try {
        // split leaves Token
        const token = CheckHeader.split(' ')[1];

        console.log(token);

        // import secretkey
        const secretKey = process.env.SECRET_KEY ?? '';

        // verify token
        const tokenVerify = jwt.verify(token, secretKey) as { userId: string };

        // Check if the user exists in the database
        const tokenrecord = await prisma.token.findFirst({
            where: {
                Token: token,
                UserID: tokenVerify.userId,
                Expiration: {
                    gte: new Date(),
                },
            },
        });

        if (!tokenrecord) {
            return res.status(401).json({ message: 'Token not found.' });
        } else {
            console.log('Token in database', tokenrecord);
        }

        if (tokenrecord.Expiration < new Date()) {
            return res.status(401).json({ message: 'Token has expired.' });
        } else {
            console.log('Token has not expired');
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
};

export { authLoginMailMiddleware };
