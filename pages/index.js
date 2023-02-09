import { useState, useEffect } from "react";
import Head from "next/head";
import { GithubIcon } from "components/icons/GithubIcon";
import { vanaApiPost } from "vanaApi";
import { LoginHandler } from "components/auth/LoginHandler";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import Image from "next/image";
import Scrollytelling from "components/Scrollytelling";

const DEFAULT_PERSON = "Barack Obama";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const uploader = Uploader({
  apiKey: "free",
});

const options = { multi: false };

export default function Home() {
  // User State
  const [user, setUser] = useState({
    balance: 0,
    exhibits: [],
    textToImage: [],
    loggedIn: false,
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Image Caption State
  const [imageUrl, setImageUrl] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const prompt = imageCaption
    ? `a portrait of {target_token} in the style of ${imageCaption}`
    : "Prompt not ready";

  // Generating Image State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);

  const generatePersonalizedImages = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("About to call API");
      const urls = await vanaApiPost(`images/generations`, {
        prompt: prompt,
        n: 4,
      });
      console.log("urls", urls);
      setGeneratedImages(urls);
    } catch (error) {
      setErrorMessage("An error occurred while generating the image");
    }

    setIsLoading(false);
  };

  const getImageCaption = async (images) => {
    console.log("Running");
    setImageUrl(images[0].fileUrl);
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          // We could also try using the LAION clip model but the
          // openai one seemed to produce prompts for better images
          clip_model_name: "ViT-L-14/openai",
          image: images[0].fileUrl,
          mode: "fast",
        },
      }),
    });
    let multi = await response.json();
    setPrediction(multi);
    const predictionId = multi.uuid;
    if (response.status !== 201) {
      setError(multi.detail);
      return;
    }
    while (multi.status !== "succeeded" && multi.status !== "failed") {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + predictionId);
      const { prediction } = await response.json();
      multi = prediction;
      if (response.status !== 200) {
        setError(multi.detail);
        return;
      }
      setPrediction(prediction);
    }
    setImageCaption(multi.output);
  };

  const generateNonPersonalizedImages = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const defaultPersonPrompt = prompt.replace(
      /\{target_token}/g,
      DEFAULT_PERSON
    );
    const response = await fetch("/api/stable-diffusion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          prompt: defaultPersonPrompt,
          num_outputs: 4,
        },
      }),
    });

    let multi = await response.json();
    const predictionId = multi.uuid;
    if (response.status !== 201) {
      setError(multi.detail);
      return;
    }
    while (multi.status !== "succeeded" && multi.status !== "failed") {
      await sleep(1000);
      const response = await fetch("/api/stable-diffusion/" + predictionId);
      const { prediction } = await response.json();
      multi = prediction;
      if (response.status !== 200) {
        setError(multi.detail);
        return;
      }
    }
    const formattedUrls = {
      data: multi.output.map((imageUrl) => ({ url: imageUrl })),
    };
    setGeneratedImages(formattedUrls);
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Portraits from Images</title>
        <meta name="description" content="Face Style Transfer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <header className="header">
        <a
          href="https://github.com/annakaz/face-style-transfer"
          target="_blank"
        >
          <GithubIcon />
        </a>
      </header> */}
      <main className="main">
        {/* Hero */}
        <div
          className="h-[80vh] flex flex-col justify-center items-center bg-white"
          style={{
            boxShadow: "1px 1px 30px rgba(0,0,0,.25)",
          }}
        >
          {/* Bold title */}
          <h1 className="text-7xl font-bold text-center max-w-4xl mb-4">
            A Visual Introduction to Prompt Engineering
          </h1>
          {/* Faint subtitle */}
          <h2 className="text-2xl text-gray-500 text-center max-w-4xl">
            By the team at{" "}
            <a
              href="https://www.vana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Vana.
            </a>
            {/* Upload an image to reverse engineer the prompt created it. Then
            apply the prompt to create new images, with the option to make them
            of yourself. */}
          </h2>
        </div>
        <Scrollytelling />
        {/* Title text */}
        <div className="bg-stone-200">
          <div className="flex flex-col gap-2 py-12 px-2">
            <h1 className="text-5xl font-bold text-center max-w-4xl w-full mx-auto mb-4">
              What if we could use AI's own imagination to create new images?
            </h1>
            <h2 className="text-2xl text-gray-500 text-center font-light max-w-4xl w-full mx-auto mb-6">
              Enter prompt engineering.
            </h2>
            {/* Body text */}
            <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-2xl mx-auto w-full">
              Prompt engineering is the process of creating a prompt that will
              effectively guide an AI model to produce a desired output.
            </p>
            <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-2xl mx-auto w-full">
              Consider a simple prompt, given to a popular image generation
              model, DALL-E:
            </p>
            <blockquote
              className="font-mono text-md text-gray-600 text-left leading-snug font-light
            bg-white p-4 my-4 rounded-sm max-w-3xl mx-auto w-full"
            >
              &gt; "a man wearing a red shirt."
            </blockquote>
            <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-2xl mx-auto w-full">
              This prompt will produce an image, but is it exactly what you had
              in mind?
            </p>
            <br />
            <div
              className="rounded-sm overflow-hidden w-max-content mx-auto"
              style={{ boxShadow: "1px 1px 15px rgba(0,0,0,.45)" }}
            >
              <Image src="/images/red-shirt.png" width={300} height={300} />
            </div>
            <br />
            <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-2xl mx-auto w-full">
              Maybe, but most likely not. If you were to ask the model to
              produce something closer to your imagination, you would need to be{" "}
              <span className="font-bold">more specific.</span> Perhaps you
              could request a certain pose, or a certain background, or a
              certain facial expression. You could also specify the the{" "}
              <span className="font-bold">style</span> of the image: is it a
              painting, a photograph, or a cartoon?
            </p>
            <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-2xl mx-auto w-full">
              Perhaps a better prompt would be:
            </p>
            <blockquote
              className="font-mono text-md text-gray-600 text-left leading-snug font-light
            bg-white p-4 my-4 rounded-sm max-w-3xl mx-auto w-full"
            >
              &gt; "a pencil and crayon image of a happy man wearing a red polo,
              close up on his face, with a blue background."
            </blockquote>
            <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-2xl mx-auto w-full">
              Depending on what you had envisioned, this was likely much much
              closer to what you had in mind.
            </p>

            <div className="image-grid grid grid-cols-2 md:grid-cols-4 gap-2 my-4 w-[max-content] mx-auto">
              <div className="rounded-sm overflow-hidden shadow-lg">
                <Image
                  src="/images/red-shirt-descriptive-1.png"
                  width={300}
                  height={300}
                />
              </div>
              <div className="rounded-sm overflow-hidden shadow-lg">
                <Image
                  src="/images/red-shirt-descriptive-2.png"
                  width={300}
                  height={300}
                />
              </div>
              <div className="rounded-sm overflow-hidden shadow-lg">
                <Image
                  src="/images/red-shirt-descriptive-3.png"
                  width={300}
                  height={300}
                />
              </div>
              <div className="rounded-sm overflow-hidden shadow-lg">
                <Image
                  src="/images/red-shirt-descriptive-4.png"
                  width={300}
                  height={300}
                />
              </div>
            </div>

            <p className="text-lg text-gray-600 text-left leading-snug font-light max-w-2xl mx-auto w-full">
              These details are the crux of prompt engineering. The more
              specific you are, the more likely the model will produce an image
              that meets your expectations. And without knowing the details of
              the model's architecture, it's impossible to know exactly what
              information it needs to produce a desired output.
            </p>
          </div>
        </div>
        <div className="image-uploader-form">
          <UploadButton
            uploader={uploader}
            options={options}
            onComplete={getImageCaption}
          >
            {({ onClick }) => (
              <button className="image-upload" onClick={onClick}>
                Select image...
              </button>
            )}
          </UploadButton>
          <div className="image-viewer">
            {imageUrl && (
              <>
                <img src={imageUrl} alt="Uploaded Image" />
                <div className="uploaded-image-detail">
                  <div className="caption">Uploaded Image Description:</div>
                  <div className="description">
                    {prediction && prediction.status === "succeeded"
                      ? imageCaption
                      : "Loading..."}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {imageCaption && (
            <>
              <label htmlFor="prompt-input">Prompt:</label>
              <div className="image-prompt">
                {prediction && prediction.status === "succeeded"
                  ? `${prompt}`
                  : "Loading..."}
              </div>
              <form onSubmit={generateNonPersonalizedImages}>
                <button type="submit">Create Portrait of Default Person</button>
              </form>
              {/* Generic inference if a user hasn't connected VNA */}
              {!user.loggedIn && (
                <>
                  <LoginHandler setUser={setUser} />
                </>
              )}
              {/* Personalized inference once a user connects VNA*/}
              {user.loggedIn && (
                <>
                  <form onSubmit={generatePersonalizedImages}>
                    <button type="submit">Create Portrait of Me</button>
                  </form>
                  <div>Credit balance: {user?.balance ?? 0}</div>
                </>
              )}
              {isLoading && <p>Loading...</p>}
              {errorMessage && <p>Error: {errorMessage}</p>}
              {/* User doesn't have a trained model*/}
              {user.loggedIn && user.exhibits.length === 0 && (
                <p>
                  Unfortunately, you haven't created a personalized Vana
                  Portrait model yet. Go to https://portrait.vana.com/create to
                  create one 🙂
                </p>
              )}
            </>
          )}
        </div>

        {/** Show the images a user has created */}
        <div className="pt-1 space-y-4">
          {generatedImages?.data?.map((image, i) => (
            <img src={image.url} key={i} className="w-full" />
          ))}
        </div>
      </main>
    </>
  );
}
