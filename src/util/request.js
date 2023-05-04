
import axios from 'axios';
// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8081/quickstart/demo/v1/',
  timeout: 2000,
  headers: { 'X-Custom-Header': 'foobar' }
});

// 设置请求和应答拦截器
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 导出请求对象
export default service;
