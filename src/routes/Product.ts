import express from 'express';
import {
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    ProductJoinCategory,
    ProductByID,
    SeachByProductName,
    getCountProductCategory,
    getProductDate,
} from '../controllers/Product';
const root = express.Router();

root.get('/Product', getProduct);
root.post('/Product', addProduct);
root.put('/Product', updateProduct);
root.delete('/Product', deleteProduct);
root.get('/ProductJoinCategory', ProductJoinCategory);
root.get('/ProductByID', ProductByID);
root.get('/SeachByProductName', SeachByProductName);
root.get('/getCountProductCategory', getCountProductCategory);
root.get('/ProductDate', getProductDate);

export default root;
