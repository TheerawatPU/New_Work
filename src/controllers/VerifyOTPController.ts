// userController.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import prisma from '../lib/db';
import jwt from 'jsonwebtoken';

const verifyOTP: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { otp, Email } = req.body;

    const schema = Joi.object({
        Email: Joi.string().email().min(1).max(255).required(),
        otp: Joi.string().required(),
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

    // ค้นหารหัส OTP ในฐานข้อมูล
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
        // ตรวจสอบว่ารหัส OTP ที่รับมาตรงกับที่อยู่ในฐานข้อมูลหรือไม่
        if (user.Otp === otp && user.OtpExpired && user.OtpExpired > new Date()) {
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
                        Expiration: new Date(Date.now() + 1 * 60 * 60 * 1000),
                        UserID: user.UserID,
                    },
                });
            } else {
                return res.status(201).json({ message: 'No Token' });
            }

            const User = {
                Email: user.Email,
                Token: token,
            };

            // ยืนยันสำเร็จ
            return res.json({ message: 'OTP verification successful And Create Token.', User });
        } else {
            // ยืนยันไม่สำเร็จ
            return res.status(400).json({ message: ' OTP has expired.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { verifyOTP };
