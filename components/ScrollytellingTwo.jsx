import StepContainer from "./StepContainer";
import StepContent from "./StepContent";
import StepTitle from "./StepTitle";
import IntersectionObserver from "./IntersectionObserver";
import ParagraphText from "./ParagraphText";
import MonaLisaImageSelector from "./MonaLisaImageSelector";

export default function ScrollytellingTwo({ step, setStep }) {
  return (
    <div className="flex flex-col justify-center items-center px-0 lg:px-4 z-10 w-full">
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(3)}>
          <StepContent centered>
            <StepTitle>Back to the Mona Lisa.</StepTitle>
            <ParagraphText>
              We can use this image—or rather, what the computer sees in this
              image—to illustrate prompt engineering at work.
            </ParagraphText>
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(4)}>
          <StepContent>
            <ParagraphText>
              Let's focus on the text description. If you fed this text
              description, and <span className="font-bold">only</span> this text
              description, to a model like DALL-E, what would it generate?
            </ParagraphText>
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(4)}>
          <StepContent centered>
            <ParagraphText>Something like this:</ParagraphText>
            <MonaLisaImageSelector />
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(5)}>
          <StepContent>
            <ParagraphText>
              Here's another question: what if we instructed the model to create
              a new image of someone else, entirely,{" "}
              <span className="font-bold">in the style of Mona Lisa</span>?
            </ParagraphText>
            <ParagraphText>
              Let's add the following phrase as a prefix to the text
              description:{" "}
              <span className="font-bold">
                "a portrait of <span className="font-serif">Nicolas Cage</span>{" "}
                in the style of..."
              </span>
            </ParagraphText>
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(6)}>
          <StepContent>
            <ParagraphText>
              The result is a glorious mix of Mona Lisa and the target token (in
              our case, Nicolas Cage).
            </ParagraphText>
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <div className="h-40 w-full bg-transparent" />
    </div>
  );
}
