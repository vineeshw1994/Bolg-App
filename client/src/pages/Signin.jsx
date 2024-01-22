import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link,useNavigate} from "react-router-dom";

import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { signInSuccess,signInFailure,signInStart } from "../redux/user/UserSlice";
import Oath from "./Oath";

const Signin = () => {
  const [formData, setFormData] = useState({});
  const {loading,error:errorMessage} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if( !formData.email || !formData.password){
      return dispatch(signInFailure("Please fill all the fields"))
    }

    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json()
      console.log('this is the response',data)

      if(data.success === false){
          dispatch(signInFailure(data.message))
        }


        if(res.ok){ 
          dispatch(signInSuccess(data))
    navigate('/')
        } 

    } catch (err) {
      dispatch(signInFailure(err.message))
    } 
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
        <div className="flex-1">
          <Link to={"/"} className=" font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
              Logic Lens
            </span>
          </Link>

          <p className="pt-5">
            This is a demo project. You can sign In with your email and password
            or with Google.
          </p>
        </div>

        {/* right side */}

        <div className="flex-1 border-2 rounded-lg p-5">
          <form onClick={handleSubmit} className="flex flex-col gap-4 ">
           
            <div className="">
              <Label value="Your Email"  />
              <TextInput type="email" placeholder="name@companay.com" id="email" onChange={handleChange} />
            </div>
            <div className="">
              <Label value="Your Password"  />
              <TextInput type="text" placeholder="*********" id="password" onChange={handleChange} />
            </div>


            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
             
              {loading ? (
                <>
                <Spinner size='sm' />
                <span className="pl-3">Loading....</span>
                </>
              ) : 'Sign In'}
            </Button>
      <Oath />

          </form>


          <div className=" flex gap-2 text-sm mt-5">
            <span>Dont Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className="mt-5" color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Signin;
