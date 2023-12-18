import { Request, Response, NextFunction } from 'express';

const TestMiddleWhere = (req: Request, res: Response, next: NextFunction) => {
    const { InputNumber } = req.query;

    if (InputNumber) {
        next(); // อนุญาตให้ผ่านไปยัง controller
    } else {
        res.status(403).json({ message: 'Please input in data' });
    }
};

export { TestMiddleWhere };
