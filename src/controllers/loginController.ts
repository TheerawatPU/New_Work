// userController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const getUserInfo: RequestHandler = async (req, res) => {
    const { Email, Password } = req.body;

    const schema = Joi.object({
        Email: Joi.string().email().min(1).max(255).required(),
        Password: Joi.string().min(1).max(255).required(),
    });

    const optionsError = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };

    const { error } = schema.validate(req.body, optionsError);

    if (error) {
        return res.status(422).json({
            status: 422,
            message: 'Unprocessable Entity',
            data: error.details,
        });
    }

    const lowercaseEmail = Email.toLowerCase();

    // search user in database
    const user = await prisma.user.findUnique({
        where: {
            Email: lowercaseEmail,
        },
    });

    // user not in database
    if (!user) {
        return res.status(404).json({ message: 'User not found in database' });
    }

    try {
        // ทำการ ถอดรหัส password ที่ป้อนมากับใน database ตรงกัน
        const passwordMatch = await bcrypt.compare(Password, user.Password);

        if (!passwordMatch) {
            return res.status(404).json({ message: 'The password is Not incorrect.' });
        }

        // create secret_key
        const secretKey = process.env.SECRET_KEY ?? '';

        // ส่งข้อมูลที่จะเข้ารหัส
        const payload = {
            userId: user.UserID,
            email: user.Email,
           
        };

        // สร้าง options หมดเวลาของ token
        const options = {
            expiresIn: '1h',
        };

        // นำทั้งหมดมาสร้าง Token
        const token = jwt.sign(payload, secretKey, options);

        // Save token to the database
        if (token) {
            await prisma.token.create({
                data: {
                    Token: token,
                    Expiration: new Date(Date.now() + 5 * 60 * 60 * 1000), 
                    UserID: user.UserID,
                },
            });
        } else {
            return res.status(201).json({ message: 'No Token' });
        }

        const User = {
            ...user,
            Token: token,
        };

        return res.json(User);

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

export { getUserInfo };
