import axios, { AxiosInstance } from 'axios';

import storage from 'libs/storage';
import { mergeDeep } from './commons';

const API_SERVER = 'http://localhost:8000/';

const getAccessToken = (): string => {
  return storage.get('access_token', null) as string;
};

export const createAxios = (configs?: object): AxiosInstance => {
  const INITIAL_CONFIGS = {
    baseURL: `${API_SERVER}`,
    withCredentials: true,
    headers: {},
  };
  return axios.create(Object.assign(INITIAL_CONFIGS, configs));
};

export const customAxios = (configs?: object): AxiosInstance => {
  const overrides = Object.assign(
    {},
    mergeDeep(
      {
        headers: {
          access_token: getAccessToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      },
      configs,
    ),
  );
  return createAxios(overrides);
};
