import axios from 'axios';

import { env } from '@/shared/config/env';

const REQUEST_TIMEOUT_MS = 10_000;

export const kakaoClient = axios.create({
  baseURL: 'https://dapi.kakao.com',
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Authorization: `KakaoAK ${env.kakaoRestApiKey}`,
  },
});
