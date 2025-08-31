import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

const DESCOPE_MANAGEMENT_TOKEN = process.env.DESCOPE_MANAGEMENT_TOKEN || '<YOUR_DESCOPE_MANAGEMENT_TOKEN>';
const DESCOPE_OUTBOUND_APP_ID = process.env.DESCOPE_OUTBOUND_APP_ID || '<YOUR_OUTBOUND_APP_ID>';

router.post('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const eventDetails = req.body;

  try {
    // Get token from Descope Outbound App
    const tokenRes = await axios.get(
      `https://api.descope.com/v1/outbound-app/token?userId=${encodeURIComponent(userId)}&appId=${encodeURIComponent(DESCOPE_OUTBOUND_APP_ID)}`,
      {
        headers: { Authorization: `Bearer ${DESCOPE_MANAGEMENT_TOKEN}` },
      }
    );

    const accessToken = tokenRes.data.token || tokenRes.data.access_token;
    if (!accessToken) {
      return res.status(403).json({ error: 'No access token retrieved from Descope outbound app' });
    }

    // Call Google Calendar API to create the event
    const calendarRes = await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      eventDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(calendarRes.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Error creating event:', err.response?.data || err.message);
      res.status(500).json({ error: 'Failed to create calendar event', details: err.response?.data });
    } else {
      console.error('Unknown error creating event:', err);
      res.status(500).json({ error: 'Failed to create calendar event' });
    }
  }
});

export default router;

