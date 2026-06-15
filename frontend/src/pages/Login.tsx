import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {authService} from "../main"
import axios from "axios"
import toast from "react-hot-toast";
import { useGoogleLogin} from '@react-oauth/google';
import {FcGoogle} from "react-icons/fc";

const Login = () => {
    const [loading,setLoading]=useState(false);
    const navigate = useNavigate();

    const responseGoogle = async(authResult: any)=>{
        setLoading(true)
        try {
            const result = await axios.post(`${authService}/api/auth/login`,{
                code: authResult["code"],
            });
            localStorage.setItem("token",result.data.token);
            toast.success(result.data.message);
            setLoading(false);
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Problem while Login")
            setLoading(false);
        }
    };

    const googleLogin=useGoogleLogin({
        onSuccess:responseGoogle,
        onError:responseGoogle,
        flow:"auth-code"
    })
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 ">
        <div className="w-full max-w-sm space-y-6">
            <h1 className="text-center text-3xl font-bold text-[#E23774]">
                Tomato
            </h1>
            <p className="text-center text-sm text-gray-500"> LogIn / SignUp </p>
            <button onClick={googleLogin} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-500 bg-white px-4 py-3 cursor-pointer">
                <FcGoogle size={25}/>{loading? "Signing In ...": "Continue With Google"}

            </button>

            <p className="text-center text-xs text-gray-400">
                By continuing,you agree with our {" "}
                <span className="text-[#E23774]">Terms of Service</span> & {" "}
                <span className="text-[#E23774]">Privacy Policy</span>
            </p>

        </div>
    </div>
  )
}

export default Login