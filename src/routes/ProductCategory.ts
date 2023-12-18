import express from 'express';
import {
    getProductCategory,
    addProductCategory,
    updateProductCategory,
    deleteProductCategory,
} from '../controllers/ProductCategory';
const root = express.Router();

root.get('/ProductCategory', getProductCategory);
root.post('/ProductCategory', addProductCategory);
root.put('/ProductCategory', updateProductCategory);
root.delete('/ProductCategory', deleteProductCategory);

export default root;
