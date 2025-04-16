import { useState } from 'react';

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (callback) => (event) => {
    event.preventDefault();
    if (validate()) {
      callback(values);
    }
  };

  const validate = () => {
    // Implement validation logic here
    // Update errors state if there are validation issues
    return true; // Return true if validation passes
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};

export default useForm;