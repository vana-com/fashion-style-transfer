import React from "react";

export default function Hero() {
  return (
    <div className="h-[90vh] flex flex-col justify-center items-center bg-white">
      <h1 className="font-serif text-7xl font-bold text-center max-w-4xl mb-4 px-8">
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
      <button
        className="absolute bottom-0 right-0 px-3 py-2 m-4 text-gray-500 font-light text-sm bg-stone-200 hover:bg-stone-100 transition duration-200 ease-in-out rounded-md cursor-pointer focus:outline-none z-10"
        onClick={() => {
          const interactive = document.querySelector("#interactive");
          interactive.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
      >
        Skip story
      </button>
    </div>
  );
}
