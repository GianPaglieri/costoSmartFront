let cachedToken = null;
let cachedExpiration = null;
let cachedPayload = null;

const decodeBase64 = (input) => {
  try {
    if (typeof atob === 'function') {
      return atob(input);
    }
    return Buffer.from(input, 'base64').toString('utf8');
  } catch (error) {
    console.error('Error decoding base64 token payload', error);
    return null;
  }
};

const parseTokenPayload = (token) => {
  if (!token) {
    cachedPayload = null;
    return null;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const decodedPayload = decodeBase64(payloadBase64);
    if (!decodedPayload) return null;
    const payload = JSON.parse(decodedPayload);
    cachedPayload = payload;
    return payload;
  } catch (error) {
    console.error('Invalid token payload', error);
    cachedPayload = null;
    return null;
  }
};

const deriveInitials = (name, email) => {
  if (name) {
    const parts = String(name).trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'US';
};

export function isTokenValid(token) {
  if (!token) return false;

  if (token === cachedToken && cachedExpiration !== null) {
    return cachedExpiration > Date.now();
  }

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const decodedPayload = JSON.parse(decodeBase64(payloadBase64));
    cachedToken = token;
    cachedExpiration = decodedPayload.exp ? decodedPayload.exp * 1000 : null;
    cachedPayload = decodedPayload;

    if (!decodedPayload.exp) return true;
    return cachedExpiration > Date.now();
  } catch (e) {
    console.error('Invalid token', e);
    cachedToken = null;
    cachedExpiration = null;
    cachedPayload = null;
    return false;
  }
}

export function getTokenPayload(token = null) {
  const activeToken = token || localStorage.getItem('token');
  if (!activeToken) {
    cachedPayload = null;
    return null;
  }
  if (activeToken === cachedToken && cachedPayload) {
    return cachedPayload;
  }
  cachedToken = activeToken;
  return parseTokenPayload(activeToken);
}

export function getCurrentUser(token = null) {
  const payload = getTokenPayload(token);
  if (!payload) return null;

  const email = payload.email || payload.correo || payload.mail || null;
  const name =
    payload.name ||
    payload.nombre ||
    payload.fullName ||
    payload.username ||
    (email ? email.split('@')[0] : null);

  return {
    name: name || 'Usuario',
    email,
    initials: deriveInitials(name, email),
    role: payload?.role || payload?.rol || 'Administrador',
    payload,
  };
}

export function logout() {
  localStorage.removeItem('token');
  try {
    localStorage.removeItem('userInfo');
  } catch (_) {}
  cachedToken = null;
  cachedExpiration = null;
  cachedPayload = null;
  try {
    const evt = new CustomEvent('auth:token-changed', { detail: { token: null } });
    window.dispatchEvent(evt);
  } catch (_) {
    // ignore environments without window or CustomEvent
  }
}
