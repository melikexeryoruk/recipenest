import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";
import PlanningAdd from "./planning/PlanningAdd";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";

const PlanningPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) navigate("/signin");

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-70 bg-white p-5">
        <h2 className="font-bold text-xl pb-5">Planningen</h2>

        <Button className="m-2" onClick={() => navigate("./list")}>
          Planningen in lijst
        </Button>
        <Button className="m-2" onClick={() => navigate("./calendar")}>
          Planningen in kalender
        </Button>
        <Button className="m-2" onClick={() => navigate("./add")}>
          Maak een nieuwe planning
        </Button>
      </aside>

      <main className="flex-1 p-6">
        {<Outlet /> ? <Outlet /> : <PlanningAdd />}
      </main>
    </div>
  );
};

export default PlanningPage;
