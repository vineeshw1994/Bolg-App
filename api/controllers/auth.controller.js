import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

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