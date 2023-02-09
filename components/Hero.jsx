import React from "react";

export default function Hero() {
  return (
    <div className="h-[90vh] flex flex-col justify-center items-center bg-white">
      <h1 className="font-serif text-7xl font-bold text-center max-w-4xl mb-4">
        A Visual Introduction to Prompt Engineering
      </h1>
      <h2 className="text-2xl text-gray-500 font-light text-center max-w-4xl">
        By the team at{" "}
        <a
          href="https://www.vana.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          Vana.
        </a>
      </h2>
    </div>
  );
}
