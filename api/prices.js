export default async function handler(req, res) {
  try {
    const { searchParams } = new URL(req.url, `https://${req.headers.host}`);
    const ids = searchParams.get('ids');
    const extra = searchParams.get('extra');

    if (!ids) {
      return res.status(400).json({ error: 'Missing ids parameter' });
    }

    const apiKey = process.env.COINGECKO_API_KEY;
    let url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=${apiKey}`;
    if (extra === '1') {
      url += '&include_market_cap=true&include_24hr_vol=true';
    }

    const r = await fetch(url);
    if (!r.ok) {
      return res.status(r.status).json({ error: 'CoinGecko request failed', status: r.status });
    }
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
