import express from 'express';
import multer from 'multer';

import { test, updateUser,deleteUser,signout,getUsers,getUser } from '../controllers/User.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/public/images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); 
    }
});

const upload = multer({ storage });
const router = express.Router(); 

router.get('/test',test);
router.put('/update/:userId',upload.single('image'),verifyToken, updateUser)
router.delete('/delete/:userId',verifyToken, deleteUser)
router.post('/signout',signout)
router.get('/getusers', verifyToken, getUsers)
router.get('/:userId',getUser)


 
export default router;    