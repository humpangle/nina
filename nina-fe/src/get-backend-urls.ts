export const getBackendUrls = (uri?: string) => {
  const apiUrl = uri || process.env.API_URL;

  if (!apiUrl) {
    throw new Error('You must set the "API_URL" environment variable');
  }

  const url = new URL(apiUrl);

  return {
    apiUrl: url.href,
    root: url.origin
  };
};

export default getBackendUrls;
