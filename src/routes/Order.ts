import express from 'express';
import { getOrder, addOrder, updateOrder, deleteOrder, OrderBydate, OrderByID } from '../controllers/Order';
const root = express.Router();
// import {authAccessLogin} from '../middleware/authAccessLogin';

// root.use(authAccessLogin);
root.get('/Order', getOrder);
root.post('/Order', addOrder);
root.put('/Order', updateOrder);
root.delete('/Order', deleteOrder);
root.get('/OrderByID', OrderByID);
root.get('/OrderBydate/:ProductDateOrder', OrderBydate);

export default root;
