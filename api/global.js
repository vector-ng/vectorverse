export default async function handler(req, res) {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const url = `https://api.coingecko.com/api/v3/global?x_cg_demo_api_key=${apiKey}`;

    const r = await fetch(url);
    if (!r.ok) {
      return res.status(r.status).json({ error: 'CoinGecko request failed', status: r.status });
    }
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
