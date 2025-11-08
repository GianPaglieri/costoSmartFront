export const buildImageUrl = (relativePath, baseURL = '') => {
  if (!relativePath) {
    return '/no-image.svg';
  }

  let cleanPath = String(relativePath).replace(/^\/+/, '').replace(/\\/g, '/');
  if (!cleanPath.startsWith('uploads/')) {
    cleanPath = `uploads/${cleanPath}`;
  }

  if (!baseURL) {
    return `/${cleanPath}`;
  }

  const normalizedBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  return `${normalizedBase}/${cleanPath}`;
};
