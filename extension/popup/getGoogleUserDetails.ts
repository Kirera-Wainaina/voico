export default async function (interactive=false) {
  const tokenResult = await chrome.identity.getAuthToken({ interactive });
  const result = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenResult.token}`,
      'content-type': 'application/json '
    }
  })
  return result.json();
}