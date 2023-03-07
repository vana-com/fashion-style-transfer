const API_HOST = "https://api.replicate.com";

export default async function handler(req, res) {
  const response = await fetch(
    // "https://replicate.com/api/models/daanelson/attend-and-excite/versions/27a10b28879cb5add1793709ff9ee8806712b756ab5fdc9542fce67a1cd04b3a/predictions/" +
    "https://replicate.com/api/models/jagilley/controlnet/versions/8ebda4c70b3ea2a2bf86e44595afb562a2cdf85525c620f1671a78113c9f325b/predictions/" +
      req.query.id,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.end(JSON.stringify(prediction));
}
