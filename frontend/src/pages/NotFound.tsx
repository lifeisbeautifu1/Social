import notFound from '../images/404.webp';

const NotFound = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[500px]">
        <img
          src={notFound}
          alt="Not found"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default NotFound;
