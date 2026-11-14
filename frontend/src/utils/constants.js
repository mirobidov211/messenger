const rawApi = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').trim().replace(/\/+$/, '');
export const API_URL = rawApi.endsWith('/api') ? rawApi : `${rawApi}/api`;

const origin = rawApi.replace(/\/api\/?$/, '');
const wsProto = origin.startsWith('https') ? 'wss:' : 'ws:';
const wsHost = origin.replace(/^https?:\/\//, '');
export const WS_URL = import.meta.env.VITE_WS_URL || `${wsProto}//${wsHost}/ws`;
