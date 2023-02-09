import React from "react";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function WrongWord({ step, children }) {
  return (
    <span
      className={classNames(
        "transition duration-300",
        step === 2 ? "text-red-500" : ""
      )}
    >
      {children}
    </span>
  );
}
