import React from "react";

const Input=(props:React.InputHTMLAttributes<HTMLInputElement>)=>{
  return(
    <input
      className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500"
      {...props}
    />
  );
};

export default Input;