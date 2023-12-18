import { RequestHandler } from 'express';

const getTest: RequestHandler = async (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'Welcome To Middlewhere!',
    });
};

export { getTest };
