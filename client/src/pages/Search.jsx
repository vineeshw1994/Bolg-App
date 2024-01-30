import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";


const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState();
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  console.log(sidebarData);
  console.log(posts);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    const sortFormUrl = urlParams.get("sort");
    const categoryFormUrl = urlParams.get("category");

    if (searchTermFormUrl || sortFormUrl || categoryFormUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFormUrl,
        sort: sortFormUrl,
        category: categoryFormUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuary = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuary}`);

      if (!res.ok) {
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 1) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategoried";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("searchTerm", sidebarData.searchTerm)
    urlParams.set("sort", sidebarData.sort)
    urlParams.set("category", sidebarData.category)
    const searchQuary = urlParams.toString()
    navigate(`/search?${searchQuary}`)
  }

  const handleShowMore = async ()=>{
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuary = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuary}`)

   if(res.ok){
    const data = await res.json();
    setPosts([...posts, ...data.posts])
    if(data.posts.length === 9){
        setShowMore(true)
    }else{
        setShowMore(false)
    }
   }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className=" p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8 " onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select onChange={handleChange} value={sidebarData.category} id="category">
              <option value="uncategorized">Uncategorized</option>
              <option value="react">React Js</option>
              <option value="next">Next Js</option>
              <option value="javascript">JS</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone='purpleToPink'>Apply Filters</Button>
        </form>
      </div>

      <div className="w-full"> 
      <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Posts Results</h1>
      
      <div className="p-7 flex flex-wrap gap-2 text-center">
       {
        !loading && posts.length === 0 && (<p className="text-xl text-gray-500 ">
          No posts found.
        </p>)
       }

       {
        loading && (
            <p className="text-xl text-gray-500">Loading...</p>
        )
       }

       {
        !loading && posts.length > 0 && posts.map((post) => {
            return <PostCard key={post._id} post={post} />
        }
            )
       }

       {
        showMore && <button onClick={handleShowMore}  className="w-full text-teal-500 text-lg hover:underline p-7">Show More</button>
       }

      </div>
      </div>
    </div>
  );
};

export default Search;
