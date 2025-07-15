import axios, { AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: process.env.AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const buildQueryString = (params?: Record<string, string | number>) => {
  if (!params) return '';
  return '?' + new URLSearchParams(params as Record<string, string>).toString();
};

const api = {
  get: (
    endpoint: string,
    params?: Record<string, string | number>,
    config: AxiosRequestConfig = {}
  ) =>
    apiClient
      .get(endpoint + buildQueryString(params), config)
      .then((res) => res.data),

  post: (
    endpoint: string,
    body: unknown,
    config: AxiosRequestConfig = {}
  ) =>
    apiClient.post(endpoint, body, config).then((res) => res.data),

  put: (
    endpoint: string,
    body: unknown,
    config: AxiosRequestConfig = {}
  ) =>
    apiClient.put(endpoint, body, config).then((res) => res.data),

  delete: (
    endpoint: string,
    config: AxiosRequestConfig = {}
  ) =>
    apiClient.delete(endpoint, config).then((res) => res.data),
};

export default api;
