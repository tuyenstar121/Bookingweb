// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // URL gốc của API của bạn
  timeout: 5000, // Thời gian chờ tối đa cho mỗi yêu cầu (ms)
});

export default instance;
