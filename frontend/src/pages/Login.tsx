import { useLocation } from 'react-router-dom';

const Login = () => {
  const { pathname } = useLocation();
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
              <div className="login__box">
                <input
                  type="email"
                  placeholder="Email"
                  className="login__input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="login__input"
                />
                <button className="login__button">Login</button>
                <span className="login__forgot">Forgot password?</span>
                <button className="login__button login__button--secondary">
                  Register Account
                </button>
              </div>
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
            <div className="login__right">
              <div className="login__box">
                <input
                  type="text"
                  placeholder="Name"
                  className="login__input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="login__input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="login__input"
                />
                <input
                  type="password"
                  placeholder="Password again"
                  className="login__input"
                />
                <button className="login__button">Sign Up</button>
                <button className="login__button login__button--secondary">
                  Log into account
                </button>
              </div>
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
