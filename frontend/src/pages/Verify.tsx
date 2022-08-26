import verify from '../images/verify.png';

const Verify = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="max-w-[400px]">
          <img
            src={verify}
            alt="Verify"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl text-gray-700 font-semibold">
          In order to create account, please confirm your email.
        </h1>
      </div>
    </div>
  );
};

export default Verify;
