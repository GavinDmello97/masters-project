import axios from "axios";
export const baseURL = process.env.REACT_APP_API_URL;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Origin: baseURL as string,
};

const ApiCaller = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: headers,
});
ApiCaller.interceptors.request.use(async function(config: any) {
  let token = await localStorage.getItem("token");
  config.headers.Authorization = token ? `bearer ${token}` : "";
  return config;
});

const apiDefault = {};

const userApiList = {
  signin: (payload: any) => {
    return ApiCaller({
      url: `/users/signin`,
      method: "post",
      data: payload,
    });
  },

  signup: (payload: any) => {
    return ApiCaller({
      url: `/users/signup`,
      method: "post",
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  usernameCheck: (payload: any) => {
    return ApiCaller({
      url: `/users/usernameCheck`,
      method: "post",
      data: payload,
    });
  },

  getUserDetails: (params?: { isProfile: boolean }) => {
    return ApiCaller({
      url: `/users/userDetails`,
      method: "get",
      params,
    });
  },

  getAllAuthors: (params: any) => {
    return ApiCaller({
      url: `/users`,
      method: "get",
      params,
    });
  },
  getAuthorDetails: (params?: { author_id: string }) => {
    return ApiCaller({
      url: `/users/authorDetails`,
      method: "get",
      params,
    });
  },

  getArticlesByCategory: (params: any) => {
    return ApiCaller({
      url: `/users/category`,
      method: "get",
      params,
    });
  },
  postToCategory: (params: any, payload: any) => {
    return ApiCaller({
      url: `/users/category`,
      method: "post",
      data: payload,
      params,
    });
  },

  deleteFromCategory: (params: any, payload: any) => {
    return ApiCaller({
      url: `/users/category`,
      method: "delete",
      data: payload,
      params,
    });
  },
};

const articleApiList = {
  getAllArticles: (params: any) => {
    return ApiCaller({
      url: `/articles`,
      method: "get",
      params,
    });
  },

  getArticle: (articleId: string, params: any) => {
    return ApiCaller({
      url: `/articles/id/${articleId}`,
      method: "get",
      params,
    });
  },

  postArticle: (payload: any) => {
    return ApiCaller({
      url: `/articles`,
      method: "post",
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  putArticle: (articleId: string, payload: any) => {
    return ApiCaller({
      url: `/articles/id/${articleId}`,
      method: "put",
      data: payload,
    });
  },

  deleteArticle: (articleId: number) => {
    return ApiCaller({
      url: `/articles/id/${articleId}`,
      method: "delete",
    });
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ApiCaller,
  ...apiDefault,
  ...userApiList,
  ...articleApiList,
};
