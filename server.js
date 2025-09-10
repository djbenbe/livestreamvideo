const express = require('express');
const app = express();
const PORT = 3000;

// Proxy endpoint voor YouTube Search API
app.get('/youtube-search', async (req, res) => {
    try {
        const apiKey = 'AIzaSyCrfYC6Ofh3FGBZ1PkwM6G9TAOljgFMCGc';
        const params = new URLSearchParams(req.query);
        params.set('key', apiKey);

        const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Proxy error', details: err.message });
    }
});

// Serveer je statische bestanden (HTML, JS, CSS)
app.use(express.static(__dirname));

// Start de server
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});