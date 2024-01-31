import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";


const UpdatePost = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const {currentUser} = useSelector((state) => state.user)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null)
  const {postId} = useParams()
 
  
 useEffect(() =>{
   try{
    const fetchPost = async () =>{
      const res  = await fetch(`/api/post/getPosts?postId=${postId}`)
      const data = await res.json()
      if(!res.ok){
        console.log(data.message)
        setPublishError(data.message)
        return
      }  
      if(res.ok){
        setPublishError(null)
        setFormData(data.posts[0])
      }
    }
    fetchPost()
   }catch(error){
    console.log(error.message)
   }
 },[postId])


 
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('please select an image')
        return
      }
      setImageUploadError(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(progress.toFixed(0))

        },
        (error) => {
          setImageUploadError('Image upload failed'),
          imageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('downloadURL', downloadURL)
            setImageUploadProgress(null)
            setImageUploadError(null)
            setFormData({ ...formData, image: downloadURL })
          })
        }
      )

    } catch (err) {
      setImageUploadError('Image upload failed')
      setImageUploadProgress(null)
      console.log(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) {
        setPublishError(data.message)
        return
      }

      if (res.ok) {
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      }

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex" onChange={(e) => setFormData({ ...formData, title: e.target.value })} value={formData.title} />
          <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData.category}>
            <option value='uncategorized'>Select a category</option>
            <option value='HTML'>HTML</option>
            <option value='CSS'>CSS</option>
            <option value='JavaScript'>JavaScript</option>
            <option value='NodeJs'>NodeJs</option>
            <option value='ReactJs'>ReactJs</option>
            <option value='NestJs'>NestJs</option>
            <option value='Prisma'>Prisma</option>
            <option value='QraphQl'>QraphQl</option>
            <option value='Docker'>Docker</option>
          </Select>

        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type='file' accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="button" gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
            {
              imageUploadProgress ? (<div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
              </div>)
                : 'Upload Image'
            }
          </Button>
        </div>
        {
          imageUploadError && (
            <Alert color='failure'>
              {imageUploadError}
            </Alert>
          )
        }
        {formData.image && (
          <img src={formData.image} alt="upload" className="w-full h-72 object-cover" />
        )}
        <ReactQuill theme="snow" value={formData.content} placeholder="write something.." className="h-72 mb-12" required onChange={(value) => { setFormData({ ...formData, content: value }) }} />
        <Button type="submit" gradientDuoTone='purpleToPink'>Update Post</Button>

        {
          publishError &&
          <Alert color='failure' className="mt-5">
            {publishError}
          </Alert>

        }
      </form>
    </div>
  )
}

export default UpdatePost