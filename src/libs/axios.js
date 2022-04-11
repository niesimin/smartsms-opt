import axios from "axios";

class HttpRequest {
  constructor(baseUrl = baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }

  getInsideConfig() {
    const config = {
      baseUrl: this.baseUrl,
      headers: {},
      timeout: 300000,
      withCredentials: true // 允许携带cookie
    };

    return config;
  }

  destroy(url) {
    delete this.queue[url];
  }

  interceptors(instance, url) {
    //请求拦截
    instance.interceptors.request.use(
      config => {
        config.headers = {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        };
        this.queue[url] = true;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        if (res.status === 200) {
          this.destroy(url);
          const { data, status } = res;
          return Promise.resolve({ data, status });
        } else {
          this.destroy("error", url);
          return Promise.reject(res); //进入Promise axios请求的catch
        }
      },
      error => {
        this.destroy("error", url);
        return Promise.reject(error);
      }
    );
  }

  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

export default HttpRequest;
