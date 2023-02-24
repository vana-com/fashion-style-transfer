import React from "react";

export default function StepContainer({ children }) {
  return (
    <div className="h-[80vh] flex flex-col justify-center items-center">
      {children}
    </div>
  );
}
