import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
   console.log('hey i am the signup post ')
   const { username, email, password } = req.body;

   if (!username || !email || !password || username === '' || email === '' || password === '') {
      next(errorHandler(400, 'All fields are required'))
   }

   try {

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = new User({ username, email, password: hashedPassword });

      await newUser.save();
      res.json({ message: "User registered successfully" });
   } catch (err) {
      next(err)
   }

}


export const signin = async (req, res, next) => {
   const { email, password } = req.body

   if (!email || !password || email === '' || password === '') {
      next(errorHandler(400, 'All fields are required'))
   }

   try {
      const validUser = await User.findOne({ email });
      if (!validUser) {
      next(errorHandler(401, 'User not found'))
      }

      const validPassword = bcrypt.compareSync(password, validUser.password);

      if(!validPassword){
        return next(errorHandler(401, 'Invalid Password'))
      }

      const token = jwt.sign({ userId: validUser._id}, process.env.JWT_SECRET,)

      const {password: pass, ...rest} = validUser._doc;

      res.status(200).cookie('access_token', token ,{
         httpOnly: true,
      }).json(rest)
      
   } catch (err) {
      next(err)
   }
}