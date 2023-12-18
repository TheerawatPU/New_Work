import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: './Images',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const uploadfile: RequestHandler = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err: any) => {
            if (err) {
                console.log('อัพโหลดไม่สำเร็จ', err);
                return res.status(500).json({ message: 'File upload failed', error: err.message });
            }

            // ดึงข้อมูลที่ได้จากการอัปโหลด
            const uploadedFile = req.file;
            console.log('อัพโหลดสำเร็จ', uploadedFile);

            // บันทึกข้อมูลลงในตาราง File ในฐานข้อมูล
            // const savedFile = await prisma.file.create({
            //     data: {
            //         FileName: uploadedFile?.originalname,
            //         Path: uploadedFile?.path,
            //         UserID: 'UserID_123', // แทนที่ด้วย UserID ของผู้ใช้ที่เกี่ยวข้อง
            //     },
            // });
            // const payload = {
            //     FileName: uploadedFile?.originalname,
            //     Path: uploadedFile?.path,
                
            // };

            // const savedFile = await prisma.file.create({
            //     data: payload,
            // });

            res.status(200).json({ message: 'File uploaded successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { uploadfile };
