import axios from "axios";

export function request(config, success, failure) {
  // 创建 axios 实例
  const instance = axios.create({
    baseURL: 'http://localhost:8090',
    timeout: 5000
  })

  // 发送网络请求
  instance(config, success, failure)
    .then(res => {
      success(res);
    })
    .catch(err => {
      failure(err);
    })
}
