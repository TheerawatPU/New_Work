// ใช้สำหรับนำ Token มาหา IDuser
import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

import prisma from '../lib/db';
import jwt from 'jsonwebtoken';

const authtokenlogin: RequestHandler = async (req, res, next) => {
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

export { authtokenlogin };
