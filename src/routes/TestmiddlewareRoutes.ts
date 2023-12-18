import express from 'express';
import { getTest } from '../controllers/TestMiddlewareController';
import { TestMiddleWhere } from '../middleware/TestMiddleware';
import { MDWMiddleware } from '../middleware/MDWMiddleware';

const root = express.Router();

// ใส่ TestMiddleWhere เพื่อทำการเช็ค Middlewhere ก่อน
root.get('/Test', TestMiddleWhere, MDWMiddleware, getTest);

export default root;
