import axios from 'axios';
import { fetchCurrentLocale } from '../../utils/localization';
import { errorInterceptor, requestInterceptor, responseInterceptor } from './interceptor';
import { AcceptType } from './type';
import * as https from 'https';
// axios.defaults.baseURL = 'http://10.10.13.158:3000';
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// Timeout seconds
axios.defaults.timeout = Number(process.env.REACT_APP_API_TIMEOUT) || 600000;
axios.interceptors.response.use(responseInterceptor, errorInterceptor);
axios.interceptors.request.use(requestInterceptor, errorInterceptor);

const defaultHeader = {
  Accept: AcceptType.json,
  'Content-Type': AcceptType.json,
};

const formHeader = {
  Accept: AcceptType.formData,
  'Content-Type': AcceptType.formData,
};

const urlEncodeHeader = {
  Accept: AcceptType.formData,
  'Content-Type': AcceptType.urlEncode,
};

class apiClient {
  constructor(token) {
    const authHeader = token && token.length > 0 ? { Authorization: 'Bearer ' + token } : null;
    const currentLocale = fetchCurrentLocale();
    this.config = {
      validateStatus: () => true,
    };
    this.headers = {
      ...defaultHeader,
      ...authHeader,
      locale: currentLocale,
    };

    this.httpsAgent = new https.Agent({
      requestCert: true,
      rejectUnauthorized: true,
    });
  }

  get = (url, body, option) => {
    option = option || {};
    const { headers, ...rest } = option;
    return axios.get(url, {
      ...this.config,
      params: {
        ...body,
      },
      headers: {
        ...this.headers,
        ...headers,
      },
      ...rest,
      httpsAgent: this.httpsAgent,
    });
  };

  post = (url, body, option) => {
    option = option || {};
    const { headers, ...rest } = option;

    return axios.post(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...headers,
      },
      ...rest,
      httpsAgent: this.httpsAgent,
    });
  };

  put = (url, body, option) => {
    option = option || {};
    const { headers, ...rest } = option;

    return axios.put(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...headers,
      },
      ...rest,
      httpsAgent: this.httpsAgent,
    });
  };

  postForm = (url, body, option) => {
    option = option || {};
    const { headers, ...rest } = option;

    return axios.post(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...formHeader,
        ...headers,
      },
      ...rest,
      httpsAgent: this.httpsAgent,
    });
  };

  postURLEncode = (url, body, option) => {
    option = option || {};
    const { headers, ...rest } = option;

    return axios.post(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...urlEncodeHeader,
        ...headers,
      },
      ...rest,
      httpsAgent: this.httpsAgent,
    });
  };

  delete = (url, body, option) => {
    option = option || {};
    const { headers, ...rest } = option;
    return axios.delete(url, {
      ...this.config,
      headers: {
        ...this.headers,
        ...headers,
      },
      data: JSON.stringify(body),
      ...rest,
      httpsAgent: this.httpsAgent,
    });
  };
}

export default apiClient;
