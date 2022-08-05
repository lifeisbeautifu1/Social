import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/user/userSlice';
import React, { useState } from 'react';
import { IError } from '../interfaces';
import axios from 'axios';

const Login = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<IError>({} as IError);
  const [formState, setFormState] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/auth' + pathname, formState);
      dispatch(login(data));
      navigate('/');
      setError({});
    } catch (error: any) {
      setError(error?.response?.data?.errors);
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
        <div className="login">
          <div className="login__wrapper">
            <div className="login__left">
              <h3 className="login__logo">Social</h3>
              <span className="login__desc">
                Connect with friends and the world around you on Social
              </span>
            </div>
            <div className="login__right">
              <form className="login__box" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={formState.username}
                  onChange={handleChange}
                  className={`login__input ${
                    error?.username && 'login__input--invalid'
                  }`}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  minLength={8}
                  value={formState.password}
                  onChange={handleChange}
                  required
                  className={`login__input ${
                    error?.password && 'login__input--invalid'
                  }`}
                />
                <button className="login__button">Login</button>
                <span className="login__forgot">Forgot password?</span>
                <button
                  className="login__button login__button--secondary"
                  onClick={() => navigate('/register')}
                >
                  Register Account
                </button>
                <div>
                  <ul className="login__errors">
                    {error &&
                      Object.keys(error).length > 0 &&
                      Object.values(error).map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }

    case '/register': {
      return (
        <div className="login">
          <div className="login__wrapper">
            <div className="login__left">
              <h3 className="login__logo">Social</h3>
              <span className="login__desc">
                Connect with friends and the world around you on Social
              </span>
            </div>
            <form className="login__right" onSubmit={handleSubmit}>
              <div className="login__box">
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Name"
                  value={formState.username}
                  onChange={handleChange}
                  className={`login__input ${
                    error.username && 'login__input--invalid'
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={formState.email}
                  onChange={handleChange}
                  className={`login__input ${
                    error.email && 'login__input--invalid'
                  }`}
                />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  minLength={8}
                  value={formState.password}
                  onChange={handleChange}
                  className={`login__input ${
                    error.password && 'login__input--invalid'
                  }`}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Password again"
                  minLength={8}
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  className={`login__input ${
                    error.confirmPassword && 'login__input--invalid'
                  }`}
                />
                <button className="login__button">Sign Up</button>
                <button
                  className="login__button login__button--secondary"
                  onClick={() => navigate('/login')}
                >
                  Log into account
                </button>
                <div>
                  <ul className="login__errors">
                    {error &&
                      Object.keys(error).length > 0 &&
                      Object.values(error).map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
    default:
      return <></>;
  }
};

export default Login;
