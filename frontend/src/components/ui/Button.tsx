import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: "primary" | "danger" | "secondary";
}

const Button = ({children,variant="primary",className="",...props}:ButtonProps)=>{
  const styles={
    primary:"bg-indigo-600 hover:bg-indigo-700 text-white",
    danger:"bg-red-500 hover:bg-red-600 text-white",
    secondary:"bg-slate-700 hover:bg-slate-600 text-white"
  };

  return(
    <button
      className={`px-5 py-2 rounded-lg font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;