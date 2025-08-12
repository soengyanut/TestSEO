import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFileMutation } from "../../features/file/fileSlice";
import { useRegisterMutation } from "../../features/auth/authSlide";

const schema = z.object({
  name: z
    .string()
    .nonempty("name is required"),
  email: z.string().nonempty("email is required").email("invalid email"),
  password: z
    .string()
    .nonempty("password is required")
    .min(4, "password must be eqaul or greater than 4 letters")
});

export default function Register2() {
  const [uploadFile] = useUploadFileMutation();
  const [registerUser] = useRegisterMutation();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [image, setImage] = useState(null); // store image meta
  const [preview, setPreview] = useState(null); // object url

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "dara",
      email: "dara@gmail.com",
      password: "qwer",
      avatar: ""
    },
    resolver: zodResolver(schema)
  });

  //   handle preview image
  const handelImagePreview = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  console.log(preview);

  const onSubmit = async (data) => {
    const formdata = new FormData();
    formdata.append("file", image);

    console.log("formdata", formdata);
    try {
      const fileRes = await uploadFile(formdata).unwrap();
      console.log("upload image", image);

      const submitData = {
        ...data,
        avatar: fileRes.location
      };

      console.log(submitData);
      await registerUser(submitData).unwrap();
    } catch (e) {
      console.log(e);
      console.log("upload image", image);
    }

    // console.log(fileRes);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-1/2 bg-gray-100 p-10 rounded-3xl"
    >
      <h1 className="text-3xl font-bold text-center text-teal-600">Register</h1>

      {/* preview */}
      {!(preview == null) && (
        <div class=" flex items-center justify-center w-[200px] h-[200px]">
          <label
            for="dropzone-file"
            class="relative z-10 w-full h-full flex flex-col items-center justify-center  border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Upload profile</span>
              </p>
            </div>
            <input
              {...register("avatar")}
              onChange={(e) => handelImagePreview(e)}
              id="dropzone-file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              type="file"
              class="hidden"
            />
            <img
              className="absolute w-[200px] h-[200px] rounded-full"
              src={preview}
              alt="preview image"
            />
          </label>
        </div>
      )}
      {/* upload image */}
      {preview == null && (
        <div class="flex items-center justify-center w-[200px] h-[200px]">
          <label
            for="dropzone-file"
            class="w-full h-full flex flex-col items-center justify-center  border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Upload profile</span>
              </p>
            </div>
            <input
              {...register("avatar")}
              onChange={(e) => handelImagePreview(e)}
              id="dropzone-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              class="hidden"
            />
          </label>
        </div>
      )}

      <div class="mb-5">
        <label
          for="name"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your name
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter name"
        />
        {errors.name && (
          <span className="text-red-600 mt-2">{errors.name.message}</span>
        )}
      </div>
      <div className="flex flex-col mb-5">
        <input
          {...register("email")}
          className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
          placeholder="email"
          type="text"
        />
        {errors.email && (
          <span className="text-red-600 mt-2">{errors.email.message}</span>
        )}
      </div>
      <div className="flex flex-col relative mb-5">
        <div
          onClick={() => setIsShowPassword(!isShowPassword)}
          className="absolute top-4 right-4"
        >
          {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
          {/* <PiEye /> */}
        </div>
        <input
          {...register("password")}
          className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
          type={isShowPassword ? "text" : "password"}
          placeholder="Password"
        />
        {errors.password && (
          <span className="text-red-600 mt-2">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
}
