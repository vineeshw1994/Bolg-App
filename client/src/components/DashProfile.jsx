import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { updateStart,updateSuccess,updateFailure } from "../redux/user/UserSlice";
const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickRef = useRef(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUpload, setImageFileUpload] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [updateImage,setUpdateImage] = useState(null)

   const [formData,setFormData] = useState({})


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    if(imageFileUpload){
      return
    }
  }, [imageFile]);
  const uploadImage = async () => {
    //     service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read, write: if request.resource.size < 2 * 1024 * 1024 && request.resource.contentType.matches('image/.*');
    //     }
    //   }
    // }
    setImageFileUpload(true)
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploading(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("could not upload(File must be less than 2MB)");
        setImageFileUploading(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUpload(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('this is the downloadUrl',downloadURL)
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePicture:downloadURL})
          setImageFileUpload(false)
        });
      }
    );
  };

  const handleChange =(e) =>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

 const handleSubmit =async(e) => {
  e.preventDefault();
  setUpdateUserError(null);
  setUpdateUserSuccess(null);
  if(Object.keys(formData).length === 0){
    setUpdateUserError("No changes made")
    return
  }
  if(imageFileUpload){
    setUpdateUserError("please wait for image to upload")
  }
  try{
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'content-Type':'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data =  await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      }else{
        dispatch(updateSuccess(data))
        setUpdateUserSuccess('user profile updated successfully')
      }
  }catch(err){
    dispatch(updateFailure(err.message))
    setUpdateUserError(err.message)
  }
 }

  
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickRef}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickRef.current.click()}
        >
          {imageFileUploading && (
            <CircularProgressbar
              value={imageFileUploading || 0}
              text={`${imageFileUploading}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: "0",
                },
                path: {
                  stroke: `rgba(62,162,199, ${imageFileUploading / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploading && imageFileUploading < 100 && "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput type="password" id="password" placeholder="password" onChange={handleChange} />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-700 flex justify-between mt-5">
        <span className="cursor-pointer ">Delete Account</span>
        <span className="cursor-pointer ">Sign Out</span>
      </div>
      {
        updateUserSuccess && (
          <Alert color='success' className="mt-5">
          {updateUserSuccess}
          </Alert>
        )
      }
      {
        updateUserError && (
          <Alert color='failure' className="mt-5">
          {updateUserError}
          </Alert>
        )
      }

     
    </div>
  );
};

export default DashProfile;
