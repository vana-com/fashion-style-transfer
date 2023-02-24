import { useState, useCallback } from "react";

export const LoginEmailForm = ({ onGetCode, onSetLoginState, loading }) => {
  const [input, setInput] = useState("");

  const handleInput = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onGetCode(input);
    },
    [onGetCode, input]
  );

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="relative flex w-full gap-1">
        <input
          type="email"
          name="email"
          placeholder="Email used with your VNA account"
          autoFocus={true}
          disabled={loading}
          value={input}
          onInput={handleInput}
          className="w-[75%] bg-gray-100 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-[25%] bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded"
        >
          {loading ? "Sending…" : "Get code"}
        </button>
      </form>
      <p
        className="user-select-none cursor-pointer text-left text-gray-400 font-light text-sm mt-1"
        onClick={() => onSetLoginState("initial")}
      >
        &larr; Back
      </p>
    </section>
  );
};
