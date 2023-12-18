import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

const loginUploadFile: RequestHandler = async (req, res) => {
    
};

export { loginUploadFile };
