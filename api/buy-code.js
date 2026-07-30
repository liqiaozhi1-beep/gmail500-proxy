const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { productCode } = req.query;
  if (!productCode) {
    return res.status(400).json({ error: 'productCode is required' });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API_KEY not configured' });
    }

    const host = process.env.API_HOST || 'https://emailapi.info';
    const response = await axios.get(`${host}/openapi/v2/mail/code/buy`, {
      params: { apiKey, productCode }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Buy code error:', error.message);
    res.status(500).json({
      error: 'Purchase failed',
      details: error.response?.data || error.message
    });
  }
};
