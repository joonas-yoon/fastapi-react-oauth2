import axios, { AxiosInstance } from 'axios';

const API_SERVER = 'http://localhost:8000/';

export const customAxios: AxiosInstance = axios.create({
  baseURL: `${API_SERVER}`,
  withCredentials: true,
});
