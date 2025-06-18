import { Plan } from "@/interfaces/Plan";
import { ReactNode, createContext, useContext, useState } from "react";

interface PlanningContextType {
  listPlan?: Plan[];
  setListPlans: React.Dispatch<React.SetStateAction<Plan[]>>;

  calendarPlan?: Plan[];
  setCalendarPlans: React.Dispatch<React.SetStateAction<Plan[]>>;
}

export const PlanningContext = createContext<PlanningContextType | undefined>(
  undefined
);

export const PlanningProvider = ({ children }: { children: ReactNode }) => {
  const [listPlan, setListPlans] = useState<Plan[]>([]);
  const [calendarPlan, setCalendarPlans] = useState<Plan[]>([]);
  return (
    <PlanningContext.Provider
      value={{ listPlan, calendarPlan, setListPlans, setCalendarPlans }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error(
      "usePlanning moet binnen een PlanningProvider gebruikt worden"
    );
  }
  return context;
};
