import axios from 'axios';

export async function createHelpEvent(userId: string, eventData: any) {
  const response = await axios.post(`/api/create-event/${encodeURIComponent(userId)}`, eventData);
  return response.data;
}
