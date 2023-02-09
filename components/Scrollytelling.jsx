import { useState } from "react";
import FixedImage from "./FixedImage";
import ScrollytellingText from "./ScrollytellingText";
import MainProse from "./MainProse";

export default function Scrollytelling() {
  const [step, setStep] = useState(0);

  return (
    <>
      <h1 className="fixed top-0">Current step: {step}</h1>
      <div className="flex flex-col justify-center items-center">
        <FixedImage step={step} />
        <ScrollytellingText step={step} setStep={setStep} />
      </div>
    </>
  );
}
