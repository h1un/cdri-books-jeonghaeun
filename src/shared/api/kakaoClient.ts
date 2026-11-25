import axios from 'axios';

import { getKakaoRestApiKey } from '@/shared/config/env';

const REQUEST_TIMEOUT_MS = 10_000;

export const kakaoClient = axios.create({
  baseURL: 'https://dapi.kakao.com',
  timeout: REQUEST_TIMEOUT_MS,
});

// API 키는 요청할 때 읽는다. 키가 없으면 요청이 실패하고, 화면에서 원인을 보여준다.
kakaoClient.interceptors.request.use((config) => {
  config.headers.Authorization = `KakaoAK ${getKakaoRestApiKey()}`;
  return config;
});
