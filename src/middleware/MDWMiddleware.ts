import { Request, Response, NextFunction } from 'express';

const MDWMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { InputNumber } = req.query;

    if (Number(InputNumber) === 1) {
        next(); // อนุญาตให้ผ่านไปยัง controller
    } else {
        res.status(403).json({ message: 'No access allowed' });
    }
};

export { MDWMiddleware };
