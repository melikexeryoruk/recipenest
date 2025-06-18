import { NavigateFunction, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const LogIn = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="flex">
      <button
        onClick={() => navigate(`/signin`)}
        className="bg-white text-black hover:text-slate-900 hover:bg-white justify-center hover:cursor-pointer"
      >
        <FaUser
          aria-hidden="true"
          style={{ color: "black" }}
          className="w-8 h-10 justify-self-center"
        />
        <div className="flex space-x-1">
          <h2 className="text-sm">Log</h2>
          <h2 className="text-sm">in</h2>
        </div>
      </button>
    </div>
  );
};

export default LogIn;
