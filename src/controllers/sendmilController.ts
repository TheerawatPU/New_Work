import { RequestHandler } from 'express';
import prisma from '../lib/db';
import nodemailer from 'nodemailer';
import Joi from 'joi';

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "733fc6ca983083",
      pass: "0505857f096d3c"
    }
  });

const sendmail: RequestHandler = async (req, res) => {
    const { Email } = req.body;

    const schema = Joi.object({
        Email: Joi.string().email().min(1).max(255).required(),
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

    const user = await prisma.user.findUnique({
        where: {
            Email: lowercaseEmail,
        },
    });

    // user not in database
    if (!user) {
        return res.status(404).json({ message: 'User not found in database' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        if (otpCode) {
            await transport.sendMail({
                from: `${user?.Email}`,
                to: 'bar@example.com, baz@example.com',
                subject: 'test Mail',
                text: 'test message Mail',
                html: `Email: ${user?.Email} <br> Name: ${user?.FullName}<br> <b>OTP  ${otpCode}</b>`,
            });

            await prisma.user.update({
                where: {
                    UserID: user.UserID,
                },
                data: {
                    Otp: otpCode,
                    OtpExpired: new Date(Date.now() + 10 * 60 * 1000), // หมดอายุใน 10 นาที
                },
                select: {
                    Otp: true,
                },
            });

            console.log(user.Otp);

            // return res.status(200).json(message:"ssss",user.Otp);
            return res.status(200).json({
                message: 'Message sent: successfully',
                Otp: user.Otp,
            });
        } else {
            return res.status(401).json({ user, message: 'Message sent: fail' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { sendmail };
