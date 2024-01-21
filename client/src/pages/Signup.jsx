import { Button, Label, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
const Signup = () => {
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
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* right side */}

        <div className="flex-1">
          <form>
            <div className="div">
              <Label value="Your username" />
              <TextInput type="text" placeholder=" Username" id="username" />
            </div>
            <div className="div">
              <Label value="Your Email" />
              <TextInput type="text" placeholder=" Email" id="email" />
            </div>
            <div className="div">
              <Label value="Your Password" />
              <TextInput type="text" placeholder=" Password" id="password" />
            </div>
            <Button gradientDuoTone='purpleToPink' type="submit" > Sign Up
            </Button>
          </form>
          <div className="">
            <span>Have an account?</span>
            <Link to='/sign-in' className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
