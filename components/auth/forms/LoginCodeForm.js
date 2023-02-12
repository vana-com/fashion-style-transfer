import { useState, useCallback } from "react";

export const LoginCodeForm = ({ onLogin, onSetLoginState, loading }) => {
  const [input, setInput] = useState("");

  const handleInput = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onLogin(input);
    },
    [onLogin, input]
  );

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="w-full flex gap-1">
        <input
          type="text"
          name="code"
          placeholder="Enter 6 digit code"
          autoFocus={true}
          value={input}
          onInput={handleInput}
          autoComplete="off"
          className="w-[60%] bg-gray-100 border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        <button
          type="submit"
          className="w-[40%] bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded
          disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={input?.length !== 6 || loading}
        >
          {loading ? "Sending…" : "Connect VNA"}
        </button>
      </form>
      <p
        className="user-select-none cursor-pointer text-left text-gray-400 font-light text-sm mt-1"
        onClick={() => onSetLoginState("emailInput")}
      >
        &larr; Back
      </p>
    </section>
  );
};
