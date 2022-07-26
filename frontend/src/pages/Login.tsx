import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/user/userSlice';
import React, { useState, useRef } from 'react';
import axios from 'axios';

const Login = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const passwordRef = useRef({} as HTMLInputElement);
  const [formState, setFormState] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      pathname === '/register' &&
      formState.password !== formState.password2
    ) {
      passwordRef.current.setCustomValidity('Passwords do not match!');
      return;
    }
    try {
      const { data } = await axios.post('/auth' + pathname, formState);
      dispatch(login(data));
      navigate('/');
    } catch (error) {
      // @ts-ignore
      console.log(error.message);
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
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="login__input"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                  className="login__input"
                />
                <button className="login__button">Login</button>
                <span className="login__forgot">Forgot password?</span>
                <button
                  className="login__button login__button--secondary"
                  onClick={() => navigate('/register')}
                >
                  Register Account
                </button>
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
                  className="login__input"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={formState.email}
                  onChange={handleChange}
                  className="login__input"
                />
                <input
                  type="password"
                  name="password"
                  required
                  ref={passwordRef}
                  placeholder="Password"
                  minLength={8}
                  value={formState.password}
                  onChange={handleChange}
                  className="login__input"
                />
                <input
                  type="password"
                  name="password2"
                  required
                  placeholder="Password again"
                  minLength={8}
                  value={formState.password2}
                  onChange={handleChange}
                  className="login__input"
                />
                <button className="login__button">Sign Up</button>
                <button
                  className="login__button login__button--secondary"
                  onClick={() => navigate('/login')}
                >
                  Log into account
                </button>
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
