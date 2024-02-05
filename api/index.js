import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/User.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/Post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config();  

const __dirname = path.dirname(fileURLToPath(import.meta.url));

mongoose.connect(process.env.MONGO).then(()=>{ 
    console.log('mongodb is connected')
}).catch((err)=>{
    console.log(err)
}) 

  
const app = express(); 
  
app.use(express.json());
app.use(cookieParser()) 

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes) 
app.use('/api/post', postRoutes)
app.use('/api/comment',commentRoutes)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

 
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message 
    })
})
 

app.listen(3000, () => {
    console.log('server is running ') 

}) 