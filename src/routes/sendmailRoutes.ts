import express from 'express';
import { sendmail } from '../controllers/sendmilController';
import { authLoginMailMiddleware } from '../middleware/authLoginMailMiddleware';

const root = express.Router();

// sendMail
root.post('/mail', sendmail);

export default root;
