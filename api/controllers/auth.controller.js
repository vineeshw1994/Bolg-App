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

      if (!validPassword) {
         return next(errorHandler(401, 'Invalid Password'))
      }

      const token = jwt.sign({ userId: validUser._id }, process.env.JWT_SECRET,)

      const { password: pass, ...rest } = validUser._doc;

      res.status(200).cookie('access_token', token, {
         httpOnly: true,
      }).json(rest)

   } catch (err) {
      next(err)
   }
}

export const google = async (req, res, next) => {
   console.log('i am the google auth')
   const { name, email, googlePhotoURL } = req.body;

   try {

      const user = await User.findOne({ email });
      if (user) {
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
         const { password: pass, ...rest } = user._doc;
         res.status(200).cookie('access_token', token, {
            httpOnly: true,
         }).json(rest)
      } else {
         const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
         const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

         const newUser = new User({
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email,
            password: hashedPassword,
            profilePicture:googlePhotoURL,
         })

         await newUser.save();

         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
         const { password: pass, ...rest } = user._doc;
         res.status(200).cookie('access_token', token, {
            httpOnly: true,
         }).json(rest)

      }

   } catch (err) {
      next(err)
   }
}