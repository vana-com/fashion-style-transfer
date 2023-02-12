import { useState, useEffect } from "react";
import { vanaApiPost } from "vanaApi";
import { LoginHandler } from "components/auth/LoginHandler";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { motion } from "framer-motion";
import Image from "next/image";

const DEFAULT_PERSON = "Nicolas Cage";
const BASE_URL = "https://vana-mit-hackathon-1-git-connor-annakaz.vercel.app/"; // 'face-style-transfer.vercel.app/'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const uploader = Uploader({
  apiKey: "free",
});

const options = { multi: false };

const statusLookup = {
  succeeded: "Your image has uploaded.",
  failed: "Your image failed to process.",
  queued: "Your image is uploading.",
  processing: "Your image is being processed.",
};

export default function Interactive() {
  // User State
  const [user, setUser] = useState({
    balance: 0,
    exhibits: [],
    textToImage: [],
    loggedIn: false,
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Which generated image is previewed
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState(null);

  // Image Caption State
  const [imageUrl, setImageUrl] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const prompt = imageCaption
    ? `a portrait of {target_token} in the style of ${imageCaption}`
    : "Prompt not ready";
  const [hoveredPersonString, setHoveredPersonString] =
    useState("{target_token}");

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
    console.log("Running image", images[0].fileUrl);
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
    console.log(multi);
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

  // FIXME: If these become fixed URLs, they can be used as the default images
  const DEFAULT_IMAGES = [
    "/images/mona.jpg",
    "images/rene.jpg",
    "images/vangogh.jpg",
    "images/vertumnus.jpg",
  ];

  return (
    <div className="bg-white min-h-screen py-2 px-4 mx-auto flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-center mb-8">
        Try it out for yourself 👇
      </h1>
      <div className="image-uploader-form text-center">
        {!imageUrl && (
          <>
            <UploadButton
              uploader={uploader}
              options={options}
              onComplete={getImageCaption}
            >
              {({ onClick }) => (
                <button
                  onClick={onClick}
                  className="bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded"
                >
                  {/* Select image... */}
                  Upload an image of someone to merge with
                </button>
              )}
            </UploadButton>
            <h2 className="text-md font-light mt-4 text-center mb-2">
              (or select a default one)
            </h2>
            <div className="flex flex-row flex-wrap justify-center gap-2">
              {DEFAULT_IMAGES.map((image) => (
                <div
                  className="cursor-pointer hover:scale-105 transition hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 rounded overflow-hidden"
                  key={image}
                  onClick={() =>
                    getImageCaption([{ fileUrl: `${BASE_URL}/${image}` }])
                  }
                >
                  <img
                    src={image}
                    alt="Default Image"
                    className="w-32 h-32 object-cover"
                    style={{
                      boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        <div className="w-full flex flex-col items-center justify-center my-6">
          {imageUrl && (
            <motion.div
              layout="position"
              className="w-full flex flex-col md:flex-row items-center justify-evenly gap-4 md:items-start"
            >
              <div className="flex-1 max-w-[500px] w-full">
                <h1 className="text-lg font-medium mb-2">
                  {/* {statusLookup[prediction?.status]} */}
                  Step 1: Upload an image of someone to merge with
                  <span
                    className=" bg-stone-200 text-xs font-light text-gray-500 px-2 py-1 rounded cursor-pointer hover:bg-stone-300 transition uppercase ml-2
                  "
                    style={{
                      verticalAlign: "middle",
                    }}
                    onClick={() => {
                      setImageUrl(null);
                    }}
                  >
                    Restart
                  </span>
                </h1>
                <img
                  src={imageUrl}
                  alt="Uploaded Image"
                  layout="position"
                  className={classNames(
                    "w-full aspect-square object-cover rounded",
                    prediction
                      ? prediction.status == "failed"
                        ? "opacity-50"
                        : prediction.status !== "succeeded"
                        ? "animate-pulse"
                        : ""
                      : ""
                  )}
                  style={{
                    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <p
                  className="text-left font-light text-gray-500 text-sm bg-stone-200 p-2"
                  style={{
                    borderRadius: "0 0 6px 6px",
                  }}
                >
                  {prediction
                    ? prediction.status !== "succeeded"
                      ? statusLookup[prediction.status]
                      : imageCaption
                    : ""}
                </p>
              </div>
              <div
                className={classNames(
                  "flex-1 max-w-[500px] w-full",
                  prediction?.status === "succeeded"
                    ? "opacity-100"
                    : "opacity-25"
                )}
              >
                <h1 className="text-lg font-medium mb-2">
                  {/* Your AI-generated face style transfer */}
                  Step 2: Create a portrait of someone else in this style
                </h1>
                {generatedImages?.data?.length > 0 ? (
                  <>
                    <img
                      src={
                        selectedGeneratedImage || generatedImages?.data[0].url
                      }
                      alt="Uploaded Image"
                      layout="position"
                      className={classNames(
                        "w-full aspect-square object-cover rounded"
                      )}
                      style={{
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <div className="mt-2 flex flex-row gap-1">
                      {generatedImages?.data?.map((image, i) => (
                        <div
                          className={classNames(
                            "flex-1 aspect-square cursor-pointer hover:scale-105 transition hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 rounded overflow-hidden",
                            selectedGeneratedImage === image.url
                              ? "ring-2 ring-offset-2 ring-blue-500"
                              : ""
                          )}
                          key={i}
                          onClick={() => setSelectedGeneratedImage(image.url)}
                        >
                          <img src={image.url} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 h-full">
                    {imageCaption && (
                      <div className="flex flex-col gap-2 h-full justify-center">
                        {/* <label htmlFor="prompt-input">Prompt:</label> */}
                        <p className="text-left text-lg font-light text-gray-600 mb-px">
                          Generate a portrait using the following prompt:
                        </p>
                        <p className="text-left font-light text-gray-500 text-lg  bg-stone-100 px-2 py-1 border border-blue-200">
                          {prediction &&
                            prediction.status === "succeeded" &&
                            `${prompt.replace(
                              "{target_token}",
                              hoveredPersonString
                            )}`}
                        </p>
                        <div className="flex flex-col gap-1 w-full">
                          <form onSubmit={generateNonPersonalizedImages}>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded w-full"
                              type="submit"
                              onMouseOver={() => {
                                setHoveredPersonString(DEFAULT_PERSON);
                              }}
                              onMouseLeave={() => {
                                setHoveredPersonString("{target_token}");
                              }}
                            >
                              Create Portrait of {DEFAULT_PERSON}
                            </button>
                          </form>
                          {/* Generic inference if a user hasn't connected VNA */}
                          {!user.loggedIn && (
                            <>
                              <LoginHandler setUser={setUser} />
                            </>
                          )}
                          {/* Personalized inference once a user connects VNA*/}
                          {user.loggedIn && (
                            <div className="flex flex-col">
                              <form onSubmit={generatePersonalizedImages}>
                                <button
                                  className="bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded w-full
                      disabled:opacity-50 disabled:cursor-not-allowed"
                                  type="submit"
                                  disabled={user?.balance == 0}
                                  onMouseOver={() => {
                                    setHoveredPersonString("you");
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredPersonString("{target_token}");
                                  }}
                                >
                                  Create Portrait of You
                                </button>
                              </form>
                              <p
                                className={classNames(
                                  "mt-px text-right font-light text-gray-500 text-sm",
                                  user?.balance == 0
                                    ? "text-red-500"
                                    : "text-gray-500"
                                )}
                              >
                                Credit balance: {user?.balance ?? 0}
                              </p>
                            </div>
                          )}
                          {isLoading && <p>Loading...</p>}
                          {errorMessage && <p>Error: {errorMessage}</p>}
                          {/* User doesn't have a trained model*/}
                          {user.loggedIn && user.exhibits.length === 0 && (
                            <p>
                              Unfortunately, you haven't created a personalized
                              Vana Portrait model yet. Go to
                              https://portrait.vana.com/create to create one 🙂
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
