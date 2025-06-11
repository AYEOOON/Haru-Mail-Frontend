import axios from 'axios';

const plainApiClient = axios.create({
  baseURL: 'http://localhost:8080',
  // 토큰 인터셉터 없음
});

export default plainApiClient;
