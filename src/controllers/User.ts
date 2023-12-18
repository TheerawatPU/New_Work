import Joi from 'joi';
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomHelpers } from 'joi';

const getuser: RequestHandler = async (req, res) => {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany();
    return res.json(users);
};

const adduser: RequestHandler = async (req, res) => {
    // create schema object
    const schema = Joi.object({
        Email: Joi.string().min(1).max(255).required(),
        Password: Joi.string().min(1).max(255).required(),
        FirstName: Joi.string().min(1).max(255).required(),
        LastName: Joi.string().min(1).max(255).required(),
        Address: Joi.object({
            province: Joi.string().max(255).required(),
            district: Joi.string().max(255).required(),
            subdistrict: Joi.string().max(255).required(),
            postcord: Joi.string().max(255).required(),
        }).max(255),
        Tel: Joi.string().min(1).max(10).required(),
        Status: Joi.boolean(),
        Remove: Joi.boolean(),
        Active: Joi.boolean(),
        Otp: Joi.string().min(1).max(511),
        OtpExpired: Joi.date(),
    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
    const { error, value: validatedData } = schema.validate(req.body, options);

    if (error) {
        return res.status(422).json({
            status: 422,
            message: 'Unprocessable Entity',
            data: error.details,
        });
    }

    const prisma = new PrismaClient();

    try {
        const duplicateUser = await prisma.user.findMany({
            where: {
                OR: [
                    { Email: { contains: validatedData.Email } },
                    { FirstName: { contains: validatedData.FirstName } },
                ],
            },
        });

        if (duplicateUser && duplicateUser.length > 0) {
            return res.status(422).json({
                status: 422,
                message: 'Email or FirstName is duplicate in the database.',
                data: {
                    Email: validatedData.Email,
                    FirstName: validatedData.FirstName,
                },
            });
        }

        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const hashedPassword = await bcrypt.hash(validatedData.Password, 10);

        const payloadUser = {
            Email: validatedData.Email,
            Password: hashedPassword,
            FirstName: validatedData.FirstName,
            LastName: validatedData.LastName,
            FullName: validatedData.FirstName + ' ' + validatedData.LastName,
            Address: validatedData.Address,
            Tel: validatedData.Tel,
            Status: validatedData.Status,
            Remove: validatedData.Remove,
            Active: validatedData.Active,
            Otp: validatedData.Otp,
            OtpExpired: new Date(),
        };

        const user = await prisma.user.create({
            data: payloadUser,
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error user',
            data: error,
        });
    }
};

//Update User
const updateuser: RequestHandler = async (req, res) => {
    const schema = Joi.object({
        UserID: Joi.string().uuid().required(),
    });

    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };

    const { error } = schema.validate(req.body, options);

    if (error) {
        return res.status(422).json({
            status: 422,
            message: 'Unprocessable Entity',
            data: error.details,
        });
    }

    const body = req.body;
    const prisma = new PrismaClient();

    return await prisma.$transaction(async function (tx) {
        const payload: any = {};

        const checkUser = await tx.user.findFirst({
            where: {
                UserID: body.UserID,
            },
        });
        if (!checkUser) {
            return res.status(422).json({ error: 'checkUser not found' });
        }

        if (body.Email) {
            payload['Email'] = body.Email;
        }

        if (body.Password) {
            payload['Password'] = body.Password;
        }

        if (body.FirstName) {
            payload['FirstName'] = body.FirstName;
        }

        if (body.LastName) {
            payload['LastName'] = body.LastName;
        }

        if (body.FullName) {
            payload['FullName'] = body.FullName;
        }

        if (body.Address) {
            payload['Address'] = body.Address;
        }

        if (body.Tel) {
            payload['Tel'] = body.Tel;
        }

        if (body.Status) {
            payload['Status'] = body.Status;
        }

        if (body.Remove) {
            payload['Remove'] = body.Remove;
        }

        if (body.Active) {
            payload['Active'] = body.Active;
        }

        const update = await tx.user.update({
            where: {
                UserID: body.UserID,
            },
            data: payload,
        });

        return res.json(update);
    });
};

//Delete User
const deleteUserAll: RequestHandler = async (req, res) => {
    const schema = Joi.object({
        UserID: Joi.string().uuid().required(),
    });

    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };

    const { error } = schema.validate(req.query, options);

    if (error) {
        return res.status(422).json({
            status: 422,
            message: 'Unprocessable Entity',
            data: error.details,
        });
    }

    const query: any = req.query;
    const prisma = new PrismaClient();

    return await prisma.$transaction(async function (tx) {
        const deletePeople = await tx.user.delete({
            where: {
                UserID: query.UserID,
            },
        });
        return res.json(deletePeople);
    });
};

//Get UserByID
const getUserByID: RequestHandler = async (req, res) => {
    const prisma = new PrismaClient();

    try {
        const { UserID } = req.query;

        const userByID = await prisma.user.findUnique({
            where: {
                UserID: String(UserID),
            },
        });

        if (!userByID) {
            return res.status(404).json({ error: 'userID not found' });
        }

        return res.json(userByID);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

//Get Search User by Email
const SearchUserEmail: RequestHandler = async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const { Email } = req.query;
        const userByEmail = await prisma.user.findMany({
            where: {
                Email: String(Email),
            },
        });

        if (!userByEmail) {
            return res.status(404).json({ error: 'email not found' });
        }

        return res.json(userByEmail);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

//Get Search User by FullName
const searchUser: RequestHandler = async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const { Email, FullName } = req.query;

        const searchUser = await prisma.user.findMany({
            where: {
                OR: [{ Email: String(Email) }, { FullName: String(FullName) }],
            },
        });

        if (!searchUser) {
            return res.status(404).json({ error: 'Email OR FullName not found' });
        }

        return res.json(searchUser);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

// Amount Most 3 User
const getAmountmost3user: RequestHandler = async (req, res) => {
    const prisma = new PrismaClient();
    const users3 = await prisma.user.findMany({
        select: {
            UserID: true,
            Email: true,
            Password: true,
            FirstName: true,
            LastName: true,
            FullName: true,
            Address: true,
            Tel: true,
            Status: true,
            Remove: true,
            Active: true,

            order: {
                select: {
                    orderDetails: {
                        select: {
                            Amount: true,
                            Price: true,
                        },
                    },
                },
            },
        },
    });

    const result = users3.map((user) => {
        const totalAmount = user.order.reduce((sum, order) => {
            return sum + order.orderDetails.reduce((orderSum, detial) => orderSum + detial.Amount, 0);
        }, 0);

        return {
            UserID: user.UserID,
            Email: user.Email,
            Password: user.Password,
            FirstName: user.FirstName,
            LastName: user.LastName,
            FullName: user.FullName,
            Address: user.Address,
            Tel: user.Tel,
            Status: user.Status,
            Remove: user.Remove,
            Active: user.Active,
            TotalAmount: totalAmount,
        };
    });

    // หาลำดับจากมากไปน้อย
    const sortedResult = result.sort((min, max) => max.TotalAmount - min.TotalAmount);
    // หา 3 อันดับแรก
    const top3Result = sortedResult.slice(0, 3);

    return res.json(top3Result);
};

export { getuser, adduser, updateuser, deleteUserAll, getUserByID, SearchUserEmail, searchUser, getAmountmost3user };
