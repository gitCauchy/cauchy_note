import axios from "axios";

export function request(config, success, failure) {
  // 创建 axios 实例
  const instance = axios.create({
    baseURL: 'http://localhost:8090',
    timeout: 5000
  })
  // 拦截器
  // instance.interceptors.request.use(config => {
  //   return config;
  // }, error => {
  //   console.log(error);
  // })
  // instance.interceptors.response.use(result => {
  //   return result;
  // }, error => {
  //   console.log(error);
  // });

  // 发送网络请求
  instance(config, success, failure)
    .then(res => {
      success(res);
    })
    .catch(err => {
      failure(err);
    })
}

// export function request2(config) {
//   // 创建 axios 实例
//   const instance = axios.create({
//     baseURL: 'http://localhost:8090',
//     timeout: 5000
//   })
//
//   return instance(config)
// }
