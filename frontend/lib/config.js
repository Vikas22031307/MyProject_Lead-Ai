const DEFAULT_API_BASE_URL = "https://leadsense-backend.onrender.com";
const NEXT_PUBLIC_API_BASE_URL = "https://leadsense-backend.onrender.com";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
}
