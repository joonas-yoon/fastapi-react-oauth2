import axios, { AxiosInstance } from 'axios';

const API_SERVER = 'http://localhost:8000/';

const access_token = JSON.parse((localStorage.getItem('access_token') as string) || '{}');

export const customAxios: AxiosInstance = axios.create({
  baseURL: `${API_SERVER}`,
  headers: {
    access_token: access_token,
    Authorization: `Bearer ${access_token}`,
  },
  withCredentials: true,
});
