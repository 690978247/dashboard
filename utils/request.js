// 配置axios

const request = axios.create({
  baseURL: 'http://apidev.sycdev.com:80', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 900000 // request timeout
})