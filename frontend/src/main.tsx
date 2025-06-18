import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Layout/RootLayout.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import MainPage from "./pages/public/MainPage.tsx";
import FavoritesPage from "./pages/public/FavoritesPage.tsx";
import PlanningPage from "./pages/public/PlanningPage.tsx";
import Signin from "./pages/public/Signin.tsx";
import MealDetailPage from "./pages/public/MealDetailPage.tsx";
import { RecipeProvider } from "./contexts/RecipesProvider.tsx";
import { FavoritesProvider } from "./contexts/FavoritesProvider.tsx";
import { PlanningProvider } from "./contexts/PlanningProvider.tsx";
import SignUp from "./pages/public/SignUp.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import CalendarPlanning from "./pages/public/planning/CalendarView.tsx";
import PlanningAdd from "./pages/public/planning/PlanningAdd.tsx";
import AddMealPage from "./pages/public/AddMealPage.tsx";
import ListPlanList from "./pages/public/planning/ListView.tsx";

const browserRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/favorieten",
        element: <FavoritesPage />,
      },
      {
        path: "/planning",
        element: <PlanningPage />,
        children: [
          {
            index: true,
            element: <ListPlanList />,
          },
          {
            path: "list",
            element: <ListPlanList />,
          },
          {
            path: "calendar",
            element: <CalendarPlanning />,
          },
          {
            path: "add",
            element: <PlanningAdd />,
          },
        ],
      },
      {
        path: "/meals/add",
        element: <AddMealPage />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/meal/:idMeal",
        element: <MealDetailPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RecipeProvider>
        <FavoritesProvider>
          <PlanningProvider>
            <RouterProvider router={browserRouter} />
          </PlanningProvider>
        </FavoritesProvider>
      </RecipeProvider>
    </AuthProvider>
  </React.StrictMode>
);
