import express from 'express';
import { verifyOTP } from '../controllers/VerifyOTPController';

const root = express.Router();

// Verify OTP
root.post('/verifyOTPcon', verifyOTP);

export default root;
