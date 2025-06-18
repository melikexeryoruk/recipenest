import { useState } from "react";

type InputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [formData, setFormData] = useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<InputElements>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setFormData(initialValues);
  };

  return { formData, handleChange, reset, setFormData };
};
