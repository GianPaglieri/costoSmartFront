let cachedToken = null;
let cachedExpiration = null;

export function isTokenValid(token) {
  if (!token) return false;

  if (token === cachedToken && cachedExpiration !== null) {
    return cachedExpiration > Date.now();
  }

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const decodedPayload = JSON.parse(atob(payloadBase64));
    cachedToken = token;
    cachedExpiration = decodedPayload.exp ? decodedPayload.exp * 1000 : null;

    if (!decodedPayload.exp) return true;
    return cachedExpiration > Date.now();
  } catch (e) {
    console.error('Invalid token', e);
    cachedToken = null;
    cachedExpiration = null;
    return false;
  }
}

export function logout() {
  localStorage.removeItem('token');
  cachedToken = null;
  cachedExpiration = null;
}

