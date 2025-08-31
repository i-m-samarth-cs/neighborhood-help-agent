import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

const DESCOPE_MANAGEMENT_TOKEN = process.env.DESCOPE_MANAGEMENT_TOKEN || '<YOUR_DESCOPE_MANAGEMENT_TOKEN>';
const DESCOPE_OUTBOUND_APP_ID = process.env.DESCOPE_OUTBOUND_APP_ID || '<YOUR_OUTBOUND_APP_ID>';

router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const response = await axios.get(
      `https://api.descope.com/v1/outbound-app/token?userId=${encodeURIComponent(userId)}&appId=${encodeURIComponent(DESCOPE_OUTBOUND_APP_ID)}`,
      {
        headers: { Authorization: `Bearer ${DESCOPE_MANAGEMENT_TOKEN}` },
      }
    );

    // Some APIs return the token in 'token', others in 'access_token'—handle both
    const accessToken = response.data.token || response.data.access_token;

    if (!accessToken) {
      return res.status(404).json({ error: 'Access token not found' });
    }

    res.json({ accessToken });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Error fetching Descope token:', err.response?.data || err.message);
      res.status(500).json({ error: 'Failed to fetch access token', details: err.response?.data });
    } else {
      console.error('Unknown error fetching Descope token:', err);
      res.status(500).json({ error: 'Failed to fetch access token' });
    }
  }
});

export default router;
