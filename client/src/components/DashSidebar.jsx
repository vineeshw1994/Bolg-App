import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiArrowSmRight, HiUser } from "react-icons/hi"
import { Link, useLocation } from "react-router-dom"
import { signoutSuccess } from "../redux/user/UserSlice"
import { useDispatch } from "react-redux"

const DashSidebar = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [tab, setTab] = useState('')

  useEffect(() =>{
    const urlParams =  new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
    console.log(tabFromUrl)
  },[location.search])

  const handleSignout = async() =>{
    try{
     const res = await fetch('/api/user/signout',{
      method: 'POST',
     })
     const data = await res.json();
     if(!data.ok){
      // dispatch(signoutFailure(data.message))
      console.log(data.message)
     }else{
      dispatch(signoutSuccess(data))
     }
    }catch(error){
      // dispatch(signoutFailure(error.message))
      console.log(error.message)
    }
  }

  return (
    <Sidebar className="w-full md:w-56" >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
        <Link to={'/dashboard?tab=profile'}>

          <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' className='cursor-pointer' as='div'>
            Profile
          </Sidebar.Item>

          </Link>
          <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}  >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar