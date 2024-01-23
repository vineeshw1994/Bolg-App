import { errorHandler } from "../utils/error.js"
import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'

export const test = (req, res) => {
   res.json({ message: 'this is the testing API' })
}

export const updateUser = async (req, res, next) => {
   console.log('update user start')

   console.log(req.user.id, req.body.username, req.params.userId)
   if (req.user.id !== req.params.userId) {
      return next(errorHandler(401, 'you are not allowed to update this user'))
   }
   console.log('here is password checking')
   if (req.body.password) {
      if (req.body.password.length < 6) {
         return next(errorHandler(401, 'password must be at least 6 characters'))
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10)
   }
   console.log('here is username checking')
   console.log(req.body.username, req.body.email)
   if (req.body.username) {
      console.log('this is username length checking')
      if (req.body.username.length < 7 || req.body.username.length > 15) {
         return next(errorHandler(400, 'username must be between 7 and 15 characters'))
      } console.log('this is empty space checking')
      if (req.body.username.includes(' ')) {
         return next(errorHandler(400, 'username cannot contain special characters'))
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
         return next(errorHandler(400, 'username must be lowercase'))
      } console.log('this is character checking')
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
         return next(errorHandler(400, 'username can only contain letters and numbers'))
      }
   }
   try {
      console.log('hey this is update user')
      const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
         $set: {
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password
         }
      }, { new: true })

      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest)
   } catch (err) {
      next(err)
   }

}