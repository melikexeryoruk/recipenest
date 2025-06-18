import PasswordInput from "@/components/PasswordInput";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API_URL } from "../../../config";
import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthProvider"; // voeg dit toe
import { Button } from "@/components/ui/button";
// type ValidationErrorType = {
//   email?: string;
//   username?: string;
//   password?: string;
// };

const initialFormValues = {
  email: "",
  voornaam: "",
  achternaam: "",
  password: "",
};

const formShema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password is too short - should be at least 6 characters."),
  voornaam: Yup.string().max(50, "Voornaam is te lang").optional(),
  naam: Yup.string().max(50, "Naam is te lang").optional(),
});

const SignUp = () => {
  const { logout } = useAuth(); // haal de logout functie uit context

  useEffect(() => {
    logout(); // zorg dat ook de context wordt gereset
  }, []);

  useEffect(() => {
    // Wis token en user-info bij bezoek aan registratiepagina
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // of wat je ook gebruikt
    // eventueel ook cookies wissen als je die gebruikt
  }, []);

  const submitHandler = async (
    values: typeof initialFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("registratie mislukt: ", errorData);
        alert("Er is iets misgelopen bij de registratie.");
        return;
      }

      const data = await response.json();
      console.log("Registratie gelukt: ", data);
      alert("Registratie succesvol!");
      resetForm();

      console.log(values);
      resetForm();
    } catch (error) {
      console.error("Fout bij registreren: ", error);
      alert("Er is een fout opgetreden tijdens het registreren.");
    }
  };

  return (
    <div className="w-md h-130 mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Registreer</h2>
      <Formik
        initialValues={initialFormValues}
        onSubmit={submitHandler}
        validationSchema={formShema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="email"
              component="small"
              className="text-red-600"
            />
          </div>
          <div>
            <label
              htmlFor="voornaam"
              className="block text-sm font-medium mb-1"
            >
              Voornaam (optioneel)
            </label>
            <Field
              type="text"
              id="voornaam"
              name="voornaam"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="voornaam"
              component="small"
              className="text-red-600"
            />
          </div>

          <div>
            <label htmlFor="naam" className="block text-sm font-medium mb-1">
              Naam (optioneel)
            </label>
            <Field
              type="text"
              id="naam"
              name="naam"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="naam"
              component="small"
              className="text-red-600"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <PasswordInput />
            <ErrorMessage
              name="password"
              component="small"
              className="text-red-600"
            />
          </div>
          <Button type="submit" className="w-full mt-5">
            Registreer
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default SignUp;
