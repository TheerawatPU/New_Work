import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const logout: RequestHandler = async (req, res) => {
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
            console.log('Token in database logout', tokenrecord);

            // Delete the token from the database
            await prisma.token.delete({
                where: {
                    TokenID: tokenrecord.TokenID,
                },
            });
        }

        console.error('logout successful');
        return res.json({ message: 'logout successful.' });
    } catch (error) {
        console.error('logout failed', error);
    }
};

export { logout };
