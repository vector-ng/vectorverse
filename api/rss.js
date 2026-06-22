export default async function handler(req, res) {
  try {
    const { url } = new URL(req.url, https://${req.headers.host}).searchParams
      ? Object.fromEntries(new URL(req.url, https://${req.headers.host}).searchParams)
      : {};

    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const r = await fetch(decodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VectorVerse/1.0; +https://vectorverse.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      }
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: 'Feed fetch failed', status: r.status });
    }

    const text = await r.text();
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(text);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
