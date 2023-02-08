export const StartLogin = ({ onSetLoginState }) => {
  return (
    <div className="content container">
      <section className="w-full space-y-4">
        <button
          onClick={() => onSetLoginState("emailInput")}
          className="primaryButton w-full"
        >
          Connect VNA
        </button>
        <p className="description">
          Don't have your VNA setup?{" "}
          <a target="_blank" href="https://portrait.vana.com/create">
            Create your face AI
          </a>
        </p>
      </section>
    </div>
  );
};
