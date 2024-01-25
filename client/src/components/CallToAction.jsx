import { Button } from "flowbite-react"

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-xl rounded-br-3xl text-center">
       <div className="flex-1 justify-center flex flex-col ">
        <h2 className="text-2xl ">want to learn more about JavaScript</h2>
        <p className="text-gray-500 my-2">checkout these resources with 100 javascript projects</p>
        <Button gradientDuoTone='purpleToPink' className="rounded-tl-xl rounded-bl-none">
            <a href="https:www./100jsprojects.com" target="_blank" rel="noopener noreferrer" >100 JavaScript Projects</a>
        </Button>
       </div> 
       <div className="p-7 flex-1">
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn_Kxvd0bLox52AODzNOsTiN84SK_qEvqBkZ_iZFbrqP0z5Bk8wrTTSDMvkWmwMmYV2iY&usqp=CAU"  />
       </div> 
    </div>
  )
}

export default CallToAction