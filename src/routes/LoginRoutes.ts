import express from 'express';
import { getUserInfo } from '../controllers/loginController';
import { authtokenlogin } from '../middleware/authtokenlogin';

const root = express.Router();

// login
root.post('/login',authtokenlogin, getUserInfo);

export default root;
