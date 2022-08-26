import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../app/hooks';
import { login } from '../features/user/userSlice';
import React, { useState, useEffect } from 'react';
import { IError } from '../interfaces';
import { createRipple } from '../config/createRipple';
import axios from 'axios';

const Login = () => {
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    user && navigate('/');
  }, [user, navigate]);

  const dispatch = useDispatch();
  const [errors, setErrors] = useState<IError>({} as IError);
  const [formState, setFormState] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    agreement: false,
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/auth' + pathname, formState);
      if (pathname === '/login') {
        dispatch(login(data));
        navigate('/');
        setErrors({});
      } else {
        console.log(data);
        navigate('/verify');
        setErrors({});
      }
    } catch (error: any) {
      setErrors(error?.response?.data?.errors);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };
  switch (pathname) {
    case '/login': {
      return (
        <div className="flex  bg-white">
          <div
            className="hidden md:block h-screen bg-center bg-cover w-36 "
            style={{ backgroundImage: 'url(./images/bricks.jpeg)' }}
          ></div>
          <div className="h-screen flex flex-col justify-center pl-6">
            <div className="w-[18rem]">
              <h1 className="mb-2 text-lg font-medium">Login</h1>
              <p className="mb-10 text-xs">
                By continuing, you agree to our User Agreement and Privacy
                Policy
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={formState.username}
                      onChange={handleChange}
                      name="username"
                      id="username"
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none shadow-inner
                  ${
                    errors.username
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-200'
                  }  focus:outline-none focus:ring-0  peer`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="username"
                      className={`absolute text-sm ${
                        errors.username ? 'text-red-500' : 'text-gray-500'
                      } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                    >
                      Username
                    </label>
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      <span className="font-medium">Oh, snapp!</span>{' '}
                      {errors.username}
                    </p>
                  )}
                </div>
                <div className="mb-2">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formState.password}
                      onChange={handleChange}
                      name="password"
                      id="password"
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none shadow-inner
                  ${
                    errors.password
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-200'
                  }  focus:outline-none focus:ring-0  peer`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="password"
                      className={`absolute text-sm ${
                        errors.password ? 'text-red-500' : 'text-gray-500'
                      } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                    >
                      Password
                    </label>
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500 hover:text-gray-600 cursor-pointer absolute top-3 right-2"
                        onClick={() => setShowPassword(!showPassword)}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-6 w-6 text-gray-500 hover:text-gray-600 cursor-pointer absolute top-3 right-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      <span className="font-medium">Oh, snapp!</span>{' '}
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  onClick={createRipple}
                  className="relative overflow-hidden w-full py-2 mb-4 text-sm font-bold text-white uppercase transition duration-200 bg-blue-500  rounded shadow-md hover:bg-blue-500/90"
                >
                  Login
                </button>
              </form>
              <small>
                Don't have an account?
                <Link
                  to="/register"
                  className="ml-1 text-blue-500 capitalize hover:underline"
                >
                  Sign Up
                </Link>
              </small>
            </div>
          </div>
        </div>
      );
    }

    case '/register': {
      return (
        <div className="flex bg-white">
          <div
            className="hidden md:block h-screen bg-center bg-cover w-36"
            style={{ backgroundImage: 'url(./images/bricks.jpeg)' }}
          ></div>
          <div className="h-screen flex flex-col justify-center pl-6">
            <div className="w-[18rem]">
              <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
              <p className="mb-10 text-xs">
                By continuing, you agree to our User Agreement and Privacy
                Policy
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-1 cursor-pointer  border-gray-100 border"
                    name="agreement"
                    checked={formState.agreement}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        agreement: e.target.checked,
                      })
                    }
                    id="agreement"
                  />
                  <label
                    htmlFor="agreement"
                    className="text-xs cursor-pointer "
                  >
                    I agree to get emails about cool stuff on Social
                  </label>
                </div>
                <div className="mb-2">
                  <div className="relative">
                    <input
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
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
                      <span className="font-medium">Oh, snapp!</span>{' '}
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="mb-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={formState.username}
                      onChange={handleChange}
                      name="username"
                      id="username"
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none shadow-inner
                  ${
                    errors.username
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-200'
                  }  focus:outline-none focus:ring-0  peer`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="username"
                      className={`absolute text-sm ${
                        errors.username ? 'text-red-500' : 'text-gray-500'
                      } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                    >
                      Username
                    </label>
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      <span className="font-medium">Oh, snapp!</span>{' '}
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <div className="relative password">
                    <div
                      id="popover-password"
                      role="tooltip"
                      className="inline-block absolute right-[-105%] top-[-120%]  z-10 w-72 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                    >
                      <div className="p-3 space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Must have at least 6 characters
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
                          <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
                          <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
                          <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
                        </div>
                        <p>It’s better to have:</p>
                        <ul>
                          <li className="flex items-center mb-1">
                            <svg
                              className="mr-2 w-4 h-4 text-green-400 dark:text-green-500"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Upper & lower case letters
                          </li>
                          <li className="flex items-center mb-1">
                            <svg
                              className="mr-2 w-4 h-4 text-gray-300 dark:text-gray-400"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            A symbol (#$&)
                          </li>
                          <li className="flex items-center">
                            <svg
                              className="mr-2 w-4 h-4 text-gray-300 dark:text-gray-400"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            A longer password (min. 12 chars.)
                          </li>
                        </ul>
                      </div>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formState.password}
                      onChange={handleChange}
                      name="password"
                      id="password"
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none shadow-inner
                  ${
                    errors.password
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-200'
                  }  focus:outline-none focus:ring-0  peer`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="password"
                      className={`absolute text-sm ${
                        errors.password ? 'text-red-500' : 'text-gray-500'
                      } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                    >
                      Password
                    </label>
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500 hover:text-gray-600 cursor-pointer absolute top-3 right-2"
                        onClick={() => setShowPassword(!showPassword)}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-6 w-6 text-gray-500 hover:text-gray-600 cursor-pointer absolute top-3 right-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      <span className="font-medium">Oh, snapp!</span>{' '}
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="mb-2">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formState.confirmPassword}
                      onChange={handleChange}
                      name="confirmPassword"
                      id="confirmPassword"
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none shadow-inner
                  ${
                    errors.confirmPassword
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-200'
                  }  focus:outline-none focus:ring-0  peer`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="confirmPassword"
                      className={`absolute text-sm ${
                        errors.confirmPassword
                          ? 'text-red-500'
                          : 'text-gray-500'
                      } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                    >
                      Password again
                    </label>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      <span className="font-medium">Oh, snapp!</span>{' '}
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={createRipple}
                  type="submit"
                  className="relative overflow-hidden w-full py-2 mb-4 text-sm font-bold text-white uppercase transition duration-200 bg-blue-500 shadow-md rounded hover:bg-blue-500/90"
                >
                  Sign Up
                </button>
              </form>
              <small>
                Already a redditor?
                <Link
                  to="/login"
                  className="ml-1 text-blue-500 capitalize hover:underline"
                >
                  Login
                </Link>
              </small>
            </div>
          </div>
        </div>
      );
    }
    default:
      return <></>;
  }
};

export default Login;
