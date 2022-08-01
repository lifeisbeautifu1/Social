import { Outlet } from 'react-router-dom';
import { Navbar } from './';

const SharedLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default SharedLayout;
