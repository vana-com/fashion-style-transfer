const API_HOST = "https://api.replicate.com";

export default async function handler(req, res) {
  const response = await fetch(
    `https://replicate.com/api/models/stability-ai/stable-diffusion/versions/5b703f0fa41880f918ab1b12c88a25b468c18639be17515259fb66a83f4ad0a4/predictions/${req.query.id}`,
    {
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.end(JSON.stringify(prediction));
}