/*
 * @Author: 18059301505 275895816@qq.com
 * @Date: 2023-03-29 08:37:54
 * @LastEditors: 18059301505 275895816@qq.com
 * @LastEditTime: 2023-04-07 16:44:47
 * @FilePath: \quickstart-demo\src\util\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
//import JSONBIG from 'json-bigint';
// 增加插件解决后端Long到前端转化进度丢失的问题
// axios.defaults.transformResponse = [
//   function (data) {
//     const json = JSONBIG({
//       storeAsString: true
//     });
//     return json.parse(data);
//   }
// ];
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
    console.log('请求拦截...');
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    console.log('应答拦截...');
    // 对响应数据做点什么
    //let commonResponse = response.data;

    return response.data;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 导出请求对象
export default service;
