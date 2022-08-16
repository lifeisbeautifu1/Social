import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../app/hooks';
import { login } from '../features/user/userSlice';
import React, { useState, useEffect } from 'react';
import { IError } from '../interfaces';
import axios from 'axios';

const Login = () => {
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    user && navigate('/');
  }, []);

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
      dispatch(login(data));
      navigate('/');
      setErrors({});
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
        <div className="flex bg-white">
          <div
            className="h-screen bg-center bg-cover w-36"
            style={{ backgroundImage: 'url(./images/bricks.jpeg)' }}
          ></div>
          <div className="flex flex-col justify-center pl-6">
            <div className="w-[18rem]">
              <h1 className="mb-2 text-lg font-medium">Login</h1>
              <p className="mb-10 text-xs">
                By continuing, you agree to our User Agreement and Privacy
                Policy
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <input
                    type="text"
                    className={`w-full px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.username && 'border-red-500'
                    }`}
                    onChange={handleChange}
                    value={formState.username}
                    name="username"
                    placeholder="Username"
                  />
                  <small className="text-red-600 font-medim">
                    {errors.username}
                  </small>
                </div>
                <div className="mb-2 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.password && 'border-red-500'
                    }`}
                    onChange={handleChange}
                    value={formState.password}
                    name="password"
                    placeholder="Password"
                  />
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute h-5 w-5 top-[12px] right-[10px] cursor-pointer text-gray-600 transition duration-300 hover:scale-105 hover:text-gray-800"
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
                      className="absolute h-5 w-5 top-[12px] right-[10px] cursor-pointer text-gray-600 transition duration-300 hover:scale-105 hover:text-gray-800"
                      onClick={() => setShowPassword(!showPassword)}
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

                  <small className="text-red-600 font-medim">
                    {errors.password}
                  </small>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 mb-4 text-sm font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded hover:bg-blue-500/90"
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
            className="h-screen bg-center bg-cover w-36"
            style={{ backgroundImage: 'url(./images/bricks.jpeg)' }}
          ></div>
          <div className="flex flex-col justify-center pl-6">
            <div className="w-[18rem]">
              <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
              <p className="mb-10 text-xs">
                By continuing, you agree to our User Agreement and Privacy
                Policy
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    className="mr-1 cursor-pointer "
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
                  <input
                    type="text"
                    className={`w-full px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.email && 'border-red-500'
                    }`}
                    onChange={handleChange}
                    value={formState.email}
                    name="email"
                    placeholder="Email"
                  />
                  <small className="text-red-600 font-medim">
                    {errors.email}
                  </small>
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className={`w-full px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.username && 'border-red-500'
                    }`}
                    onChange={handleChange}
                    value={formState.username}
                    name="username"
                    placeholder="Username"
                  />
                  <small className="text-red-600 font-medim">
                    {errors.username}
                  </small>
                </div>
                <div className="mb-2 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.password && 'border-red-500'
                    }`}
                    onChange={handleChange}
                    value={formState.password}
                    name="password"
                    placeholder="Password"
                  />
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute h-5 w-5 top-[12px] right-[10px] cursor-pointer text-gray-600 transition duration-300 hover:scale-105 hover:text-gray-800"
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
                      className="absolute h-5 w-5 top-[12px] right-[10px] cursor-pointer text-gray-600 transition duration-300 hover:scale-105 hover:text-gray-800"
                      onClick={() => setShowPassword(!showPassword)}
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
                  <small className="text-red-600 font-medim">
                    {errors.password}
                  </small>
                </div>
                <div className="mb-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.confirmPassword && 'border-red-500'
                    }`}
                    onChange={handleChange}
                    value={formState.confirmPassword}
                    name="confirmPassword"
                    placeholder="Password again"
                  />
                  <small className="text-red-600 font-medim">
                    {errors.confirmPassword}
                  </small>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 mb-4 text-sm font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded hover:bg-blue-500/90"
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
