import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

export const verifyToken = (req, res, next) => {
    console.log('this is the verification ')
    const token = req.cookies.access_token
    if (!token) {
        return next(errorHandler(401, 'User not authenticated'))   
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized'))
        }
        console.log('this is the user ', user)
        req.user = user 
        next() 
    })
}