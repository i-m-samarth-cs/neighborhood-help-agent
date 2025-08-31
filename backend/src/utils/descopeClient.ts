import axios from 'axios';

const DESCOPE_MANAGEMENT_TOKEN = process.env.DESCOPE_MANAGEMENT_TOKEN || '<YOUR_DESCOPE_MANAGEMENT_TOKEN>';
const DESCOPE_OUTBOUND_APP_ID = process.env.DESCOPE_OUTBOUND_APP_ID || '<YOUR_OUTBOUND_APP_ID>';

// Get OAuth access token from Descope for given user
export async function getAccessToken(userId: string): Promise<string> {
  const resp = await axios.get(
    `https://api.descope.com/outbound/v1/token?userId=${encodeURIComponent(userId)}&appId=${DESCOPE_OUTBOUND_APP_ID}`,
    { headers: { Authorization: `Bearer ${DESCOPE_MANAGEMENT_TOKEN}` } }
  );
  return resp.data.access_token;
}
