import express from 'express';
import { loginUploadFile } from '../controllers/loginUploadFileController';
import { uploadfile } from '../controllers/uploadfileController';
// import multer from 'multer';
import { authLoginUploadfile } from '../middleware/authLoginUploadfileMiddleware';

// const upload = multer();

const root = express.Router();

// sendMail
root.post('/uploadfile', uploadfile);

export default root;
