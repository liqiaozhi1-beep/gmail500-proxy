// api/stock.js
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

    // 调用 Gmail500 官方库存 API
    const response = await axios.get('https://emailapi.info/openapi/v2/proudct/stock', {
      params: {
        apiKey: apiKey,
        productCode: productCode
      }
    });

    // 直接返回 Gmail500 的响应
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Stock query error:', error.message);
    res.status(500).json({
      error: 'Failed to query stock',
      details: error.response?.data || error.message
    });
  }
};
