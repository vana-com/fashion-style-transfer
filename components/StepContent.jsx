import React from "react";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function StepContent({ centered, children }) {
  return (
    <div
      className={classNames(
        "px-6 py-6 bg-white/80 rounded-md shadow-lg backdrop-filter backdrop-blur-lg flex flex-col gap-2",
        centered ? "items-center text-center" : "items-start",
        "text-gray-700 font-lighter leading-snug",
        "max-w-[600px]"
      )}
    >
      {children}
    </div>
  );
}
