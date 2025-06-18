import PasswordInput from "@/components/PasswordInput";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { API_URL } from "../../../config";
import { Button } from "@/components/ui/button";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

const initialFormValues = {
  email: "",
  password: "",
};

const Signin = () => {
  const { login } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  const submitHandler = async (
    values: typeof initialFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login mislukt: ", errorData);
        alert("Er is iets misgelopen bij de login.");
        return;
      }

      const data = await response.json();
      console.log("Login gelukt: ", data);
      alert("Login succesvol!");

      const user_data = data[1];
      const token_data = data[0];
      login(user_data, token_data);

      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Fout bij inloggen: ", error);
      alert("Er is een fout opgetreden tijdens het inloggen.");
    }
  };

  return (
    <div className="w-110 h-125 mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Log in</h2>
      <Formik
        initialValues={initialFormValues}
        onSubmit={submitHandler}
        // validationSchema={formShema}
        // validateOnChange={false}
        // validateOnBlur={false}
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
          {/* <a
            onClick={() => navigate("/nofoundpage")}
            className="text-sm text-black hover:underline hover:cursor-pointer p-2"
          >
            Wachtwoord vergeten?
          </a> */}
          <div className="mt-30 mb-auto">
            <Button type="submit" className="w-full my-4">
              Log in
            </Button>
            <div className="flex w-full">
              <p>Nog geen account?</p>
              <Button
                type="button"
                className="ml-auto"
                onClick={() => navigate("/signup")}
              >
                Registreer
              </Button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Signin;
