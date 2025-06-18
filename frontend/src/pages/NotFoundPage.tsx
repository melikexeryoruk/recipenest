import { Button } from "@/components/ui/button";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <p className="text-lg text-gray-700">Oops! Page not found.</p>
        <Button className="bg-red-500 text-white" onClick={() => navigate("/")}>
          Click here to go back home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
