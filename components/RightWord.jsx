import React from "react";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function RightWord({ step, children }) {
  return (
    <span
      className={classNames(
        "transition duration-300",
        step === 2 ? "opacity-100" : ""
      )}
    >
      {children}
    </span>
  );
}
