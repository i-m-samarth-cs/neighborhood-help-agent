import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create axios instance for Google API to **bypass proxies**
const googleAxios = axios.create({
  // disable proxy for Google API
  proxy: false,
  // if you have corporate proxy, configure it here explicitly instead of disabling
  // proxy: { host: 'your.proxy.host', port: 8080 }
});

// Fetch outbound tokens as before
async function getUserOutboundTokens(sessionToken: string) {
  const managementToken = process.env.DESCOPE_MANAGEMENT_TOKEN!;
  const projectId = process.env.DESCOPE_PROJECT_ID!;

  const verifyResponse = await axios.post(
    `https://api.descope.com/v1/projects/${projectId}/token/verify`,
    { token: sessionToken },
    { headers: { Authorization: `Bearer ${managementToken}` } }
  );
  const userId = verifyResponse.data.sub;

  const outboundAppIds = ['gmail', 'google-calendar'];
  const tokens: Record<string, string> = {};

  for (const appId of outboundAppIds) {
    try {
      const res = await axios.get(
        `https://api.descope.com/v1/projects/${projectId}/users/${userId}/outbound-app/${appId}/token`,
        { headers: { Authorization: `Bearer ${managementToken}` } }
      );
      tokens[appId] = res.data.token;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(`Failed to get token for "${appId}":`, e.response?.data || e.message);
      } else {
        console.error(`Unknown error getting token for "${appId}":`, e);
      }
    }
  }
  return tokens;
}

app.post('/api/create-event', async (req, res) => {
  const { event, email } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Invalid authorization header format' });
  }

  const sessionToken = parts[1];

  try {
    const outboundTokens = await getUserOutboundTokens(sessionToken);
    const googleCalendarToken = outboundTokens['google-calendar'];

    if (!googleCalendarToken) {
      return res.status(403).json({ error: 'User has not granted Google Calendar permission' });
    }

    console.log('Sending event to Google Calendar API:', JSON.stringify(event));

    // Use the axios instance with proxy disabled for Google API call
    const calendarResponse = await googleAxios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      event,
      {
        headers: {
          Authorization: `Bearer ${googleCalendarToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Google Calendar API response:', calendarResponse.data);
    return res.json(calendarResponse.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Google API error status:', error.response?.status);
      console.error('Google API error data:', error.response?.data);
      return res.status(500).json({
        error: 'Google API error',
        status: error.response?.status,
        details: error.response?.data,
      });
    }
    console.error('Unexpected server error:', error);
    return res.status(500).json({ error: 'Unexpected server error', details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
