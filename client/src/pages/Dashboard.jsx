import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DashSidebar from "../components/DashSidebar"
import DashProfile from "../components/DashProfile"
import DashPost from "../components/DashPost"
import DashUsers from "../components/DashUsers"
import DashComments from "../components/DashComments"
import DashboardComp from "../components/DashboardComp"
const Dashboard = () => {
  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect(() =>{
    const urlParams =  new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
    // console.log(tabFromUrl)
  },[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">

      {/* side bar */}
         <DashSidebar />
    </div>

    {/* profile */}
    {tab === 'profile' && <DashProfile />}

    {/* posts */}
    {tab === 'posts' && <DashPost/>}

    {/* users */}
   {tab === 'users' && <div><DashUsers /></div>}

   {/* comments */}

   {tab === 'comments' && <div><DashComments /> </div>}

   {/* dashboard comp */}
   {tab === 'dash' && <div><DashboardComp /></div>}

   {/* category */}
   {/* {tab === 'categorys' && <div><Categorys /></div>} */}


    </div>
  )
}

export default Dashboard