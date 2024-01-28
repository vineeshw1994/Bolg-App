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


export const likeComment = async(req,res,next) => {
  try{
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){ 
      return next(errorHandler(404,'comment not found'))
    }
    const userIndex = comment.likes.indexOf(req.user.id)
    if(userIndex === -1){
      comment.numberOfLikes +=1
      comment.likes.push(req.user.id)

    } else{
      comment.numberOfLikes -=1
      comment.likes.splice(userIndex,1)
    }
    await comment.save()
    res.status(200).json(comment)
  }catch(error){
    next(error)
  }
}

export const editComment = async(req,res,next) => {
  console.log('this is the edited comment')
  try{
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
      return next(errorHandler(404,'comment not found'))
    }
    if(comment.userId !== req.user.id && !req.user.isAdmin){
      return next(errorHandler(401,'your not edit this comment'))
    }
    // comment.comment = req.body.comment
    // await comment.save()

    const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,{content:req.body.content},{new:true})
    res.status(200).json(editedComment)
  }catch(error){
    next(error)
  }
}

export const deleteComment = async(req,res,next) => {
  try{
    console.log('this is the delete comment')
  const comment = await Comment.findById(req.params.commentId)
  if(!comment){
    return next(errorHandler(404,'comment not found'))
  } 
  if(comment.userId !== req.user.id && !req.user.isAdmin){
    return next(errorHandler(401,'your not delete this comment'))
  }
  await Comment.findByIdAndDelete(req.params.commentId)
  res.status(200).json('comment deleted')
  }catch(error){
    next(error)
  }
}

export const getcomments = async(req,res,next) => {
  console.log('hey this the getcomments function ')
  if(!req.user.isAdmin){
    return next(errorHandler(401,'you are not allowed to get all comments'))
  }

  try{
   const startIndex = (req.query.startIndex) || 0
   const limit = parseInt((req.query.limit) || 10)
   const sortDirection = req.query.sort === 'desc' ? -1 : 1
   const comments = await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit)
   const totalComments = await Comment.countDocuments()
   const  now = new Date()
   const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
   const lastMonthcomments = await Comment.countDocuments({createdAt: {$gte: oneMonthAgo}})
   res.status(200).json({comments,totalComments,lastMonthcomments})
  }catch(error){
    next(error)
  }
}