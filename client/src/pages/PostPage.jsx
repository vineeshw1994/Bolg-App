import { Button, Spinner } from "flowbite-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
const PostPage = () => {
const {postSlug} = useParams()
const [post,setPost] = useState(null)
const [loading,setLoading] = useState(true)
const [error,setError] = useState(false) 

useEffect(()=>{
  const fetchPost = async () => {
    try{
     setLoading(true)
     const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
     const data = await res.json()
     if(!res.ok){
      setError(data.message)
      setLoading(false)
      return
     }

     if(res.ok){
      setPost(data.posts[0])
      setLoading(false)
      setError(false)
     }
    }catch(error){
      console.log(error.message)
      setError(true)
      setLoading(false)
    }
  }
  fetchPost()
},[postSlug])

if(loading) return (
  <div className="flex justify-center items-center min-h-screen">
    <Spinner size="xl" />
  </div>
)
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif mx-auto max-w-2xl lg:text-4xl">{post &&post.title}</h1>
      <Link to={`/search?category=${post && post.category}`}className="self-center mt-5">
        <Button color="gray" pill size='xs' >{post && post.category}</Button>
      </Link>
      <img src={post && post.image} alt={post && post.title} className="mt-10 p-3 max-h-[500px] w-full object-cover" />
      <div className="flex justify-between p-3 border-b border-slate-300 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">{post && (post.content /1000).toFixed(0)}mins read</span>
      </div>
      <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html:post && post.content}}>

      </div>
    </main>
  )
}

export default PostPage