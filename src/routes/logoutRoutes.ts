import express from 'express';
import { logout } from '../controllers/logout';

const root = express.Router();

// login
root.post('/logout', logout);

export default root;
