
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle,} from "react-icons/hi";
import {  FaCheck , FaTimes } from "react-icons/fa";


const DashComments= () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true)
  const [showModel, setShowModel] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState("")
  console.log('this is the getcomments', comments)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const res = await fetch(`/api/comment/getcomments/getPosts?startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok) {
        setComments([...comments, ...data.posts])
        if (data.users.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteComment = async () => {
    setShowModel(false)
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, { method: "DELETE" })
      const data = await res.json()
      if (res.ok) {
        setComments((prev) => prev.filter((user) => user._id !== commentIdToDelete) 
        )
        setShowModel(false)
      }else{
        console.log(data.message)
      } 
    } catch (error) { 
      console.log(error.message)
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number of  Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              
            </Table.Head>
            {comments.map((comments) => (
              <Table.Body key={comments._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-800 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comments.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                   {comments.content}
                  </Table.Cell>
                  <Table.Cell>
                   {comments.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{comments.postId}</Table.Cell>
                  <Table.Cell>{comments.userId}</Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
                      setShowModel(true)
                      setCommentIdToDelete(comments._id)
                    }} className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                  </Table.Cell>
                 
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                Show More
              </button>
            )
          }
        </>
      ) : (
        <p>You have no comments yet</p>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete to this comment</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>Yes, i am sure</Button>
              <Button color="gray" onClick={() => setShowModel(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashComments
