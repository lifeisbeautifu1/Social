import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { createRipple } from '../config/createRipple';

const ResetPassword = () => {
  const [errors, setErrors] = useState<any>({});
  const [reset, setReset] = useState(false);
  const [email, setEmail] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        await axios.post('/auth/reset/password', {
          email,
        });
        setReset(true);
        setErrors({});
      } catch (error: any) {
        console.log(error);
        setErrors(error?.response?.data?.errors);
      }
    }
  };
  return (
    <div className="flex  bg-white">
      <div
        className="block h-screen bg-center bg-cover w-36 "
        style={{
          //   backgroundColor: 'rgb(96, 165, 250)',
          backgroundImage: 'url(../images/bricks.jpeg)',
        }}
      ></div>
      <div className="h-screen flex flex-col justify-center pl-6">
        <div className="w-[18rem]">
          <h1 className="mb-2 text-lg font-medium">Reset Passowrd</h1>
          <p className="mb-2 text-xs">Please enter email adress</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  id="email"
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none shadow-inner
                  ${
                    errors.email
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-200'
                  }  focus:outline-none focus:ring-0  peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className={`absolute text-sm ${
                    errors.email ? 'text-red-500' : 'text-gray-500'
                  } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                >
                  Email
                </label>
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  <span className="font-medium">Oh, snapp!</span> {errors.email}
                </p>
              )}
            </div>
            <button
              type="submit"
              onClick={createRipple}
              disabled={reset}
              className="relative overflow-hidden w-full py-2 mb-4 text-sm font-bold text-white uppercase transition duration-200 bg-blue-500  rounded shadow-md hover:bg-blue-500/90"
            >
              Reset Password
            </button>
          </form>
          {reset && (
            <p className="text-sm text-green-400">Please check your email</p>
          )}

          <p className="text-sm">
            <Link
              to="/register"
              className=" text-blue-500 capitalize hover:underline"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-sm">
            <Link
              className=" text-blue-500 capitalize hover:underline"
              to="/login"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
