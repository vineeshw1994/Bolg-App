import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/UserSlice"
import { useNavigate } from "react-router-dom"

const Oath = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogle = async () => {
        const Provider = new GoogleAuthProvider();
        const auth = getAuth(app)

        // Provider.setCustomParameters({prompt:'select_accout'})

        try {
            const resultFromGoogle = await signInWithPopup(auth, Provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoURL: resultFromGoogle.user.photoURL,
                })
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Button type="button" gradientDuoTone='pinkToOrange' outline onClick={handleGoogle}>
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Continue with Google
        </Button>
    )
}

export default Oath