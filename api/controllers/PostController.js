import { errorHandler } from "../utils/error.js"
import Post from "../models/Post.model.js"
import { find } from "ramda"
export const create = async (req, res, next) => {
  console.log('this is the post create')

  if (!req.user.isAdmin) {
    return next(errorHandler(400, "Admin resource. Access denied"))
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'please provide all required fields'))
  }
  const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')

  const newPost = new Post({ ...req.body, slug, userId: req.user.id })

  try {
    const savedPost = await newPost.save()
    res.status(201).json(savedPost)
  } catch (err) {
    console.log(err.message)
  }
} 

// export const getposts = async (req, res, next) => {
//   console.log('this is the post get')
//   try { 
//     const startIndex = parseInt(req.query.startIndex) || 0
//     const limit = parseInt(req.query.limit) || 9
//     const sortDirection = req.query.order === 'asc' ? 1 : -1
//     const posts = await find(
//       ...(req.query.userId && { userId: req.query.userId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { _id: req.query.postId }),
//       ...Post(req.query.searchTerm && {
//         $or: [ 
//           { title: { $regex: req.query.searchTerm, $options: 'i' } },
//           { content: { $regex: req.query.searchTerm, $options: 'i' } }
//         ]
//       })  
 
//     ).sort({ updateAt: sortDirection }).skip(startIndex).limit(limit)

//     const totalPosts = await Post.countDocuments()

//     const now = new Date()
//     const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

//     const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } })

//     res.status(200).json({
//       posts,
//       totalPosts,
//       lastMonthPosts
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

export const getposts = async (req, res, next) => {
  console.log('this is the post get')
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === 'asc' ? 1 : -1
    
    const filter = {};

    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.postId) {
      filter._id = req.query.postId;
    }

    if (req.query.searchTerm) {
      filter.$or = [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { content: { $regex: req.query.searchTerm, $options: 'i' } }
      ];
    }

    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; 

 
export const deletePost = async (req, res,next) => {
  console.log('this is the post delete')
  console.log(req.params.userId,req.user.id)
  if(!req.user.isAdmin || req.user.id !== req.params.userId){
    return next(errorHandler(403, "You are not allowed to delete this post"))
  }

  try{
    await Post.findByIdAndDelete(req.params.postId)
    res.status(200).json({message: "Post deleted successfully"})
  }catch(error){
    next(error)
  }
}