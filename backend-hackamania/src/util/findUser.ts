import { SLACK_BOT_TOKEN } from "../constants";
const axios = require('axios');

export async function findUserIdByHandle(handle: string) {
  const resp = await axios.get('https://slack.com/api/users.list', {
    headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` }
  });
  // handle may have '@', so remove it
  const username = handle.replace(/^@/, '');
  // search by name or display_name
  const user = resp.data.members.find((u: any) =>
    u.name === username ||
    (u.profile && u.profile.display_name === username)
  );
  return user ? user.id : null;
}