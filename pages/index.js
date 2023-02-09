import { useState, useEffect } from "react";
import Head from "next/head";
import { GithubIcon } from "components/icons/GithubIcon";
import { vanaApiPost } from "vanaApi";
import { LoginHandler } from "components/auth/LoginHandler";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import Image from "next/image";
import Scrollytelling from "components/Scrollytelling";
import Hero from "components/Hero";

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
        <Hero />
        <Scrollytelling />

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
