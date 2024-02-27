export default async function () {
  const tokenResult = await chrome.identity.getAuthToken({interactive: true});
  const result = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenResult.token}`,
      'content-type': 'application/json '
    }
  })
  return result.json();
}