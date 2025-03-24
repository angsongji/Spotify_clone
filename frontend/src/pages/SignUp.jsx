import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex items-center  justify-center min-h-screen bg-neutral-800">
      <div className="bg-neutral-950 p-8 flex flex-col items-center justify-center rounded-lg shadow-md w-180">
        <img
          className="w-10 mb-5 h-10 mx-auto"
          src="../../public/logo1.svg"
          alt="logo"
        />
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-50">
          Đăng ký để bắt đầu nghe
        </h2>
        <form className="w-80">
          <div className="mb-2 ">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="username"
            >
              Địa chỉ email
            </label>
            <input
              className="w-full text-white  border-gray-400  border hover:border-white rounded-lg px-3 py-2 placeholder:text-gray-500"
              id="username"
              type="text"
              placeholder="name@domain.com"
            />

            <div className="mb-6 mt-3">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <input
                className="w-full text-white  border-gray-400 border hover:border-white rounded-lg px-3 py-2 placeholder:text-gray-500"
                id="password"
                type="password"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <button
            className="bg-green-500 hover:bg-green-700 text-black cursor-pointer font-bold py-3 px-4 mt-5 rounded-full w-full"
            type="submit"
          >
            Tiếp theo
          </button>
        </form>
        <div className=" flex items-center my-4  w-100 ">
          <hr className="flex-grow border-t-1 ml-10 border-gray-500" />
          <span className="mx-4 text-white ">hoặc</span>
          <hr className="flex-grow border-t mr-10 border-gray-500" />
        </div>

        <div className="flex flex-col justify-center items-center">
          <button className="rounded-full flex items-center w-80 border text-center border-gray-400 font-bold  cursor-pointer hover:border-white text-white px-3 py-2 mb-2">
            <span>
              <img
                className="w-7 h-7 ml-4"
                src="../../public/logo-google.png"
                alt="logo-google"
              />
            </span>
            <span className="px-7 w-60 text-white">Đăng ký bằng Google</span>
          </button>
          <button className="rounded-full flex items-center w-80 border text-center border-gray-400 font-bold cursor-pointer hover:border-white text-white px-3 py-2 mb-8">
            <span>
              <img
                className="w-7 h-7 ml-4"
                src="../../public/logo-facebook.png"
                alt="logo-facebook"
              />
            </span>
            <span className="px-7 w-60 text-white">Đăng ký bằng Facebook</span>
          </button>
        </div>

        <hr className="border-t-1 border-gray-800 w-80 mx-auto  " />

        <div className="flex mt-10">
          <p className="text-gray-500">Bạn đã có tài khoản? </p>
          <Link
            to="/sign-in"
            className="ml-2 text-white underline font-bold  hover:text-green-600"
          >
            Đăng nhập tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
