import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { useLoginMutation } from "../../features/auth/authSlide";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import { useState } from "react";
import { useLoginWithGoogle } from "../../components/social-auth/GogoleAuthComponent";
import { useLoginWithGitHub } from "../../components/social-auth/GithubAuthComponent";
import { useLoginWithFacebook } from "../../components/social-auth/FacebookAuthComponent";

// import social media image
import FacebookLogo from '../../assets/social-media/facebook.jpg'
import GithubLogo from '../../assets/social-media/github.png'
import GoogleLogo from '../../assets/social-media/google.png'

export default function Login() {
  // Uncomment and implement your login mutation if available
  // const [login, { isLoading, isSuccess }] = useLoginMutation();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  // Social logins
  const { loginWithGoogle } = useLoginWithGoogle();
  const { loginWithGitHub } = useLoginWithGitHub();
  const { loginWithFacebook } = useLoginWithFacebook();

  const shcema = z.object({
    email: z.string().nonempty("email is required").email(),
    password: z.string().nonempty("password is required")
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(shcema)
  });

  // Dummy login handler (replace with your mutation logic)
  const onSubmit = async (data) => {
    try {
      let result = await Login(data).unwrap();
      if (result != undefined) {
        navigate("/");
      }
      toast.success("Login successful (demo only)");
      reset();
    } catch (errors) {
      toast.error(errors?.data?.message || "Login failed");
      console.log("ERROR: ", errors?.data?.message);
    }
  };

  return (
    <section className="bg-teal-600 w-[100%] min-h-screen flex justify-center items-center">
      <div className="flex min-w-sm md:min-w-xl bg-white p-10 rounded-2xl gap-5 ">
        <img
          src="/public/register.gif"
          alt="register-image"
          className="sm:hidden lg:flex w-1/2 object-contain"
        />
        <div className="flex flex-col gap-5 flex-grow-1 justify-center min-w-[300px]">
          <h1 className="text-3xl text-center py-2 font-bold text-teal-600">
            Login
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <input
                {...register("email")}
                className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
                placeholder="Email"
                type="text"
              />
              {errors.email && (
                <span className="text-red-600 mt-2">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col relative">
              <div
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute top-4 right-4 cursor-pointer"
              >
                {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
              </div>
              <input
                {...register("password")}
                className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-600 mt-2">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 px-5 py-2 rounded-xl text-white"
            >
              Login
            </button>
          </form>
          <p className="text-center">
            Don't have any account?{" "}
            <Link to={"/register"} className="text-blue-500 underline">
              Register
            </Link>
          </p>
          <p className="text-center">Or Login With</p>
          {/* Social login media */}
          <div className="flex gap-2 items-center w-full justify-center mt-2">
            <button onClick={loginWithGoogle}>
              <img src={GoogleLogo} alt="google provider" width={35} height={35} />
            </button>
            <button onClick={loginWithFacebook}>
              <img src={FacebookLogo} alt="facebook provider" width={30} height={30} />
            </button>
            <button onClick={loginWithGitHub}>
              <img src={GithubLogo} alt="github provider" width={30} height={30} />
            </button>
          </div>
          {/* Logout buttons */}
        
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
