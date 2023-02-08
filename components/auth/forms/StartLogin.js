export const StartLogin = ({ onSetLoginState }) => {
  return (
      <section className="w-full space-y-4">
        <button
          onClick={() => onSetLoginState("emailInput")}
          // className="primaryButton w-full"
        >
          Connect VNA to Create Portrait of You
        </button>
        <p className="description">
          Don't have your VNA setup?{" "}
          <a target="_blank" href="https://portrait.vana.com/create">
            Create your face AI
          </a>
        </p>
      </section>
  );
};
