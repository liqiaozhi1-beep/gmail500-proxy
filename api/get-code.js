const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderNo, locktime } = req.query;
  if (!orderNo) {
    return res.status(400).json({ error: 'orderNo is required' });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API_KEY not configured' });
    }

    const host = process.env.API_HOST || 'https://emailapi.info';
    const params = { apiKey, orderNo };
    if (locktime) {
      params.locktime = parseInt(locktime, 10);
    }

    const response = await axios.get(`${host}/openapi/v2/mail/code`, {
      params
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get code error:', error.message);
    res.status(500).json({
      error: 'Failed to get code',
      details: error.response?.data || error.message
    });
  }
};
