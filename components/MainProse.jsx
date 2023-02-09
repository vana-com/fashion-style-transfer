import Image from "next/image";

export default function MainProse() {
  return (
    <div
      className="w-full bg-white z-10"
      style={{
        boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.25)",
      }}
    >
      <div className="flex flex-col gap-2 py-12 px-2">
        <h1 className="font-serif text-5xl font-bold text-center max-w-4xl w-full mx-auto mb-4">
          What if we could use AI's own imagination to create new images?
        </h1>
        {/* <h2 className="text-2xl text-gray-500 text-center font-light max-w-4xl w-full mx-auto mb-6">
          Enter prompt engineering.
        </h2> */}
        {/* Body text */}
        <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-xl mx-auto w-full">
          Prompt engineering is the process of creating a prompt that will
          effectively guide an AI model to produce a desired output.
        </p>
        <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-xl mx-auto w-full">
          Consider a simple prompt, given to a popular image generation model,
          DALL-E:
        </p>
        <blockquote
          className="font-mono text-md text-gray-600 text-left leading-snug font-light
            bg-stone-100 p-4 my-4 rounded-sm max-w-2xl mx-auto w-full"
        >
          &gt; "a man wearing a red shirt."
        </blockquote>
        <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-xl mx-auto w-full">
          This prompt will produce an image, but is it exactly what you had in
          mind?
        </p>
        <br />
        <div
          className="rounded-sm overflow-hidden w-max-content mx-auto"
          style={{ boxShadow: "1px 1px 15px rgba(0,0,0,.45)" }}
        >
          <Image src="/images/red-shirt.png" width={300} height={300} />
        </div>
        <br />
        <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-xl mx-auto w-full">
          Maybe, but most likely not. If you were to ask the model to produce
          something closer to your imagination, you would need to be{" "}
          <span className="font-bold">more specific.</span> Perhaps you could
          request a certain pose, or a certain background, or a certain facial
          expression. You could also specify the the{" "}
          <span className="font-bold">style</span> of the image: is it a
          painting, a photograph, or a cartoon?
        </p>
        <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-xl mx-auto w-full">
          Perhaps a better prompt would be:
        </p>
        <blockquote
          className="font-mono text-md text-gray-600 text-left leading-snug font-light
            bg-stone-100 p-4 my-4 rounded-sm max-w-2xl mx-auto w-full"
        >
          &gt; "a pencil and crayon image of a happy man wearing a red polo,
          close up on his face, with a blue background."
        </blockquote>
        <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-xl mx-auto w-full">
          Depending on what you had envisioned, this was likely much much closer
          to what you had in mind.
        </p>

        <div className="image-grid flex flex-wrap gap-4 justify-center items-center max-w-7xl mx-auto my-4">
          <div className="rounded-sm overflow-hidden shadow-lg relative h-48 w-48 md:w-72 md:h-72">
            <Image src="/images/red-shirt-descriptive-1.png" fill />
          </div>
          <div className="rounded-sm overflow-hidden shadow-lg relative h-48 w-48 md:w-72 md:h-72">
            <Image src="/images/red-shirt-descriptive-2.png" fill />
          </div>
          <div className="rounded-sm overflow-hidden shadow-lg relative h-48 w-48 md:w-72 md:h-72">
            <Image src="/images/red-shirt-descriptive-3.png" fill />
          </div>
          <div className="rounded-sm overflow-hidden shadow-lg relative h-48 w-48 md:w-72 md:h-72">
            <Image src="/images/red-shirt-descriptive-4.png" fill />
          </div>
        </div>

        <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-xl mx-auto w-full">
          These details are the crux of prompt engineering. The more specific
          you are, the more likely the model will produce an image that meets
          your expectations. And without knowing the details of the model's
          architecture, it's impossible to know exactly what information it
          needs to produce a desired output.
        </p>
      </div>
    </div>
  );
}
