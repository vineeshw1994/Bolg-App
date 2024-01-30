import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
const Home = () => {
  const [posts, setPosts] = useState([]);
  console.log("this is the getpost for home", posts);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-semibold lg:text-6xl">
          Welcome to my Blog
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you`ll find a variety of articles and turorials on topics such as
          web development, software engineering , and programming langauages.
        </p>

        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 fond-bold hover:underline"
        >
          view all posts
        </Link>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="">
            <h2 className="text-2xl font-semibold text-center m-5">Recent Posts</h2>
            <div className=" flex flex-wrap gap-4">
              {posts.map((post) => {
                return <PostCard key={posts._id} post={post} />;
              })}
            </div>
            <Link to={'/search'} className="text-teal-500 text-lg hover:underline text-center">
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
