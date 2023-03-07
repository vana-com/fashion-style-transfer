const API_HOST = "https://api.replicate.com";

// Copied from https://github.com/replicate/inpainter
// Very similar to /api/predictions but I didn't want to deal
// with passing a URL around
export default async function handler(req, res) {
  console.log("going to make prediction");

  const response = await fetch(
    "https://replicate.com/api/models/jagilley/controlnet/versions/8ebda4c70b3ea2a2bf86e44595afb562a2cdf85525c620f1671a78113c9f325b/predictions",
    // "https://replicate.com/api/models/daanelson/attend-and-excite/versions/27a10b28879cb5add1793709ff9ee8806712b756ab5fdc9542fce67a1cd04b3a/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    }
  );
  console.log("made prediction");
  console.log(response);

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error?.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
