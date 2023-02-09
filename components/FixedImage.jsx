import { useEffect } from "react";
import Image from "next/image";
import RightWord from "./RightWord";
import WrongWord from "./WrongWord";
import { AnimatePresence, motion, useSpring } from "framer-motion";

export default function FixedImage({ step }) {
  const imageTranslateY = useSpring(0, {
    stiffness: 60,
    damping: 10,
    mass: 0.5,
    ease: "easeOut",
  });

  const imageOpacity = useSpring(1, {
    stiffness: 60,
    damping: 10,
    mass: 0.5,
    ease: "easeOut",
  });

  useEffect(() => {
    console.log("step changed to", step);
    if (step === 0) {
      //   imageTranslateY.set(0);
      imageOpacity.set(1);
    }
    if (step === 1) {
      //   imageTranslateY.set(-20);
      imageOpacity.set(1);
    }

    if (step === 2) {
      imageOpacity.set(1);
    }

    if (step === 3) {
      imageOpacity.set(1);
    }

    if (step === 4) {
      imageOpacity.set(0);
    }
  }, [step]);

  return (
    <div className="sticky top-0 z-1 h-screen w-screen flex flex-col justify-center items-center">
      <motion.div style={{ y: imageTranslateY, opacity: imageOpacity }} layout>
        <div
          className="rounded-md overflow-hidden"
          style={{ boxShadow: "1px 1px 20px black" }}
        >
          <Image
            src="/images/mona.jpg"
            alt="Mona Lisa"
            width={500}
            height={500}
          />
        </div>
      </motion.div>
      <AnimatePresence>
        {step >= 1 && (
          // FIXME: not animating on exit
          <motion.p
            layout
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              height: "max-content",
              background: "rgba(0,0,0, .5)",
              padding: "10px 12px",
              backdropFilter: "blur(15px)",
              color: "white",
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            h-max bg-black/50 backdrop-filter backdrop-blur-lg p-4 text-white font-light text-md max-w-[500px] text-left leading-snug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RightWord step={step}>
              a close up of a painting of a woman
            </RightWord>
            , <RightWord step={step}>painting of mona lisa</RightWord>,{" "}
            <RightWord step={step}>leonardo da vinci painting</RightWord>,{" "}
            <RightWord step={step}>artist leonardo davinci</RightWord>,{" "}
            <RightWord step={step}>mona lisa</RightWord>,{" "}
            <WrongWord step={step}>cave painting of the mona lisa</WrongWord>,{" "}
            <RightWord step={step}>monalisa</RightWord>,{" "}
            <WrongWord step={step}>cave painting of mona lisa</WrongWord>,{" "}
            <RightWord step={step}>by Leonardo da Vinci</RightWord>,{" "}
            <RightWord step={step}>restored painting</RightWord>,{" "}
            <WrongWord step={step}>mona lisa with a mustache</WrongWord>,{" "}
            <RightWord step={step}>da vinci painting</RightWord>,{" "}
            <RightWord step={step}>((the mona lisa))</RightWord>,{" "}
            <RightWord step={step}>mona lisa as a real person</RightWord>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
