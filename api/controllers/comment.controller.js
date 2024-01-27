import { errorHandler } from "../utils/error.js"
import Comment from "../models/comment.model.js"
import User from "../models/User.model.js"

export const createComment = async(req,res,next) => {

    try{
  const {content,postId,userId} = req.body
  if(userId !== req.user.id){
    return next(errorHandler(400,'you are not allowed to create this comment'))
  }

  const newComment = await Comment.create({
    content,
    postId,
    userId
  })
  res.status(200).json(newComment)
    }catch(error){
        next(error)
    }
}


export const getPostComments = async(req,res,next) => {
  console.log('this is the getpostComments')
  try{
  const comments = await Comment.find({postId:req.params.postId}).sort({
    createdAt: -1,
  })
  res.status(200).json(comments)
  }catch(error){
    next(error)
  }
}

