import Joi from 'joi';
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

//!Get OrderDetial
const getOrderDatail: RequestHandler = async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const OrderDetial = await prisma.orderDetial.findMany();

        if (OrderDetial.length === 0) {
            return res.status(404).json({ OrderDetail: 'None OrderDetail' });
        }
        return res.json(OrderDetial);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

//!Create OrderDetial
const addOrderDatail: RequestHandler = async (req, res) => {
    // create schema object
    const schema = Joi.object({
        OrderID: Joi.string().min(1).max(255).required(),
        ProductID: Joi.string().min(1).max(255).required(),
        Amount: Joi.number().min(1).required(),
        Price: Joi.number().precision(2).min(1).required(),
    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
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
        // const duplicateOrderShow = await tx.orderDetial.findMany({
        //     where: {
        //         OR: [
        //             { OrderID: body.OrderID },
        //             { ProductID: body.ProductID },
        //         ],
        //     },
        // });

        // if (duplicateOrderShow && duplicateOrderShow.length <= 0) {
        //     return res.status(422).json({
        //         status: 422,
        //         message: 'OrderID or ProductID is duplicate in database.',
        //         data: {
        //             OrderID: body.OrderID,
        //             ProductID: body.ProductID,
        //         },
        //     });
        // }

        // Generate salt to hash password
        // const Salt = await bcrypt.genSalt(10);

        const payloadUser = {
            OrderID: body.OrderID,
            ProductID: body.ProductID,
            Amount: body.Amount,
            Price: body.Price,
        };

        const orderDetial = await tx.orderDetial.create({
            data: payloadUser,
        });

        return res.status(201).json(orderDetial);
    });
};

const updateOrderDatail: RequestHandler = async (req, res) => {
    const schema = Joi.object({
        OrderDetailID: Joi.string().uuid().required(),
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

        const OrderDetail = await tx.orderDetial.findFirst({
            where: {
                OrderDetailID: body.OrderDetailID,
            },
        });

        if (!OrderDetail) {
            return res.status(422).json({ error: 'OrderDetail not found' });
        }

        if (body.OrderID) {
            payload['OrderID'] = body.OrderID;
        }

        if (body.ProductID) {
            payload['ProductID'] = body.ProductID;
        }
        if (body.Amount) {
            payload['Amount'] = body.Amount;
        }
        if (body.Price) {
            payload['Price'] = body.Price;
        }

        const update = await tx.orderDetial.update({
            where: {
                OrderDetailID: body.OrderDetailID,
            },
            data: payload,
        });

        return res.json(update);
    });
};

const deleteOrderDatail: RequestHandler = async (req, res) => {
    const schema = Joi.object({
        OrderDetailID: Joi.string().uuid().required(),
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
        const deleteOrderDetail = await tx.orderDetial.delete({
            where: {
                OrderDetailID: query.OrderDetailID,
            },
        });
        return res.json(deleteOrderDetail);
    });
};

export { getOrderDatail, addOrderDatail, updateOrderDatail, deleteOrderDatail };
