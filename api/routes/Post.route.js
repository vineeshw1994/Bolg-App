import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import multer from 'multer';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/public/posts/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); 
    }
});

const upload = multer({ storage });

import { create, getposts,deletePost,updatePost } from '../controllers/PostController.js';


const router = express.Router();



router.post('/create',upload.single('image'),verifyToken,create)
router.get('/getposts',getposts)
router.delete('/deletePost/:postId/:userId',verifyToken, deletePost)
router.put('/updatepost/:postId/:userId', verifyToken, updatePost)


export default router;