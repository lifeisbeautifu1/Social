import { Sidebar, Feed, Rightbar, Navbar } from '../components';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home">
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </>
  );
};

export default Home;
