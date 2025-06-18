import { NavLink, NavigateFunction, useNavigate } from "react-router-dom";
import "../index.css";
import Login from "../components/Login";
import logo from "../images/RecipeNest.png";
import { useAuth } from "@/contexts/AuthProvider";

const Header = () => {
  const navigate: NavigateFunction = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <header className="flex flex-row w-5/6 h-30 justify-between justify-self-center">
        <nav className="p-4">
          <a href="/" onClick={() => navigate("/")}>
            <img className="w-20 h-auto" src={logo} alt="logo-home" />
          </a>
        </nav>
        <nav className="bg-white p-4 w-full mt-4 ">
          <div className="flex justify-center space-x-16 mt-10">
            <NavLink
              to="/"
              className="text-m text-black font-medium hover:text-black"
            >
              Recepten
            </NavLink>
            <NavLink
              to="/favorieten"
              className="text-m text-black font-medium hover:text-black"
            >
              Favorieten
            </NavLink>
            <NavLink
              to="/planning/list"
              className="text-m text-black font-medium hover:text-black"
            >
              Planning
            </NavLink>
            <NavLink
              to="/meals/add"
              className="text-m text-black font-medium hover:text-black"
            >
              Recept +
            </NavLink>
          </div>
        </nav>
        <div className="flex justify-end items-center gap-4 mr-4">
          {isAuthenticated ? (
            <>
              <span className="font-medium">Welkom, {user?.email}</span>
              <button
                onClick={() => logout()}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Uitloggen
              </button>
            </>
          ) : (
            <Login />
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
