export const StartLogin = ({ onSetLoginState }) => {
  return (
    <section className="w-full">
      <button
        className="w-full bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded mb-2"
        onClick={() => onSetLoginState("emailInput")}
        // className="primaryButton w-full"
      >
        Connect VNA to Create Portrait of You
      </button>
      <p className="text-gray-400 text-sm font-light text-right">
        Don't have your VNA setup?{" "}
        <a
          target="_blank"
          href="https://portrait.vana.com/create"
          className="underline underline-offset-4"
        >
          Create your face AI using Vana, a platform to manage your digital
          self.
        </a>
        <a
          target="_blank"
          href="https://vana.com"
          className=" text-blue-500 mt-3 block hover:underline hover:underline-offset-4"
        >
          What&apos;s Vana? &rarr;
        </a>
      </p>
    </section>
  );
};
