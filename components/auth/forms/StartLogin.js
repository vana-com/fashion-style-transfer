export const StartLogin = ({ onSetLoginState }) => {
  return (
    <section className="w-full space-y-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded"
        onClick={() => onSetLoginState("emailInput")}
        // className="primaryButton w-full"
      >
        Connect VNA to Create Portrait of You
      </button>
      <p className="text-gray-500 text-sm">
        Don't have your VNA setup?{" "}
        <a target="_blank" href="https://portrait.vana.com/create">
          Create your face AI
        </a>
      </p>
    </section>
  );
};
