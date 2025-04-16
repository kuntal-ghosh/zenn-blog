import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-2 text-sm font-medium">{label}</label>}
      <input
        className={`border rounded-md p-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <span className="mt-1 text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export { Input };
export default Input;
