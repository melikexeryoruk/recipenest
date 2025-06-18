import { useField } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = () => {
  const [field] = useField("password");
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          id="password"
          {...field}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
      {/* {meta.touched && meta.error && (
        <small className="text-red-600">{meta.error}</small>
      )} */}
    </div>
  );
};

export default PasswordField;
