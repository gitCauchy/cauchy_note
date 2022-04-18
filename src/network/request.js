import axios from "axios";
import {Message} from "element-ui";

export function request(config, success, failure) {
  // 创建 axios 实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8090',
    timeout: 5000
  })
  instance.interceptors.response.use(response => {
    return response.data;
  }, error => {
    console.log(error);
    Message({
      message: '网络错误！',
      type: 'error'
    })
  })
  return instance(config);
}
