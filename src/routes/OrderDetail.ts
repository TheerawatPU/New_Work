import express from 'express';
import {
    getOrderDatail,
    addOrderDatail,
    updateOrderDatail,
    deleteOrderDatail,
} from '../controllers/OrderDetail';
const root = express.Router();

root.get('/OrderDatail', getOrderDatail);
root.post('/OrderDatail', addOrderDatail);
root.patch('/OrderDatail', updateOrderDatail);
root.delete('/OrderDatail', deleteOrderDatail);

export default root;
