import axios, { AxiosInstance } from 'axios';

import storage from 'libs/storage';

const API_SERVER = 'http://localhost:8000/';

const getAccessToken = (): string => {
  return storage.get('access_token', null) as string;
};

export const customAxios: AxiosInstance = axios.create({
  baseURL: `${API_SERVER}`,
  headers: {
    access_token: getAccessToken(),
    Authorization: `Bearer ${getAccessToken()}`,
  },
  withCredentials: true,
});
