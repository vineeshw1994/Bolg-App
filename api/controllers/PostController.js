import { errorHandler } from "../utils/error.js"
import Post from "../models/Post.model.js"
export const create =async (req, res, next) =>{
  console.log('this is the post create') 
   
  if(!req.user.isAdmin){
    return next(errorHandler(400,"Admin resource. Access denied"))
  } 
  if(!req.body.title || !req.body.content){
    return next(errorHandler(400,'please provide all required fields'))
  } 
  const slug = req.body.title.split(' ').join('-'). toLowerCase().replace(/[^a-zA-Z0-9-]/g, '') 

  const newPost = new Post({...req.body, slug, userId: req.user.id  })
  
  try{  
  const savedPost = await newPost.save()
  res.status(201).json(savedPost)
  }catch(err){  
    console.log(err.message) 
  }
}