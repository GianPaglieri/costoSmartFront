export function isTokenValid(token) {
  if (!token) return false;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const decodedPayload = JSON.parse(atob(payloadBase64));
    if (!decodedPayload.exp) return true;
    return decodedPayload.exp * 1000 > Date.now();
  } catch (e) {
    console.error('Invalid token', e);
    return false;
  }
}

export function logout() {
  localStorage.removeItem('token');
}
