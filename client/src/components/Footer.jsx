import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {BsFacebook,BsInstagram, BsTwitter,BsGithub} from 'react-icons/bs';
const FooterCom = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to={"/"}
              className="self-center whitespace-nowrap text-sm sm:text:xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Logic Lens
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div className="div">
              <Footer.Title title="About" />

              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.100jsprojects.com"
                  target="_black"
                  rel="noopener noreferrer"
                >
                  100 JS Projects
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_black"
                  rel="noopener noreferrer"
                >
                  Logic Lens
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div className="div">
              <Footer.Title title="Follow Us" />

              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_black" rel="noopener noreferrer">
                  Github
                </Footer.Link>
                <Footer.Link href="#" target="_black" rel="noopener noreferrer">
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div className="div">
              <Footer.Title title="Legal" />

              <Footer.LinkGroup col>
                <Footer.Link href="#" >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#" >
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between ">
          <Footer.Copyright href="#" by="Logic Lens" year={new Date().getFullYear()} />

          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon icon={BsFacebook}/>
            <Footer.Icon icon={BsInstagram}/>
            <Footer.Icon icon={BsTwitter}/>
            <Footer.Icon icon={BsGithub}/>
            {/* <Footer.Icon icon={BsFacebook}/> */}
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
