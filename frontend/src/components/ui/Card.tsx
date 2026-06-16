import React from "react";

interface CardProps{
  children:React.ReactNode;
  className?:string;
}

const Card=({children,className=""}:CardProps)=>{
  return(
    <div className={`bg-slate-800 border border-slate-700 rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
};

export default Card;