import axios from "axios";
import { stringify } from "querystring";

import { getLocalStorage } from "../utils";

const axiosInstance = axios.create({
  baseURL:  "http://localhost:3001/api/",
  timeout: 600000,
});

export const FetchAPI = async (
  path,
  method,
  headers,
  body,

  endpoint = 'http://localhost:3001/api'
) => {
  const token = getLocalStorage('access_token');
  const defaultHeaders = {
    accept: "application/json",
    "Content-type": "application/json",
    Authorization: token ? `Bearer ${token}` : "no-author",
  };
  if (typeof headers === "object") Object.assign(defaultHeaders, headers);

  try {
    return await axios({
      url: endpoint + path,
      method,
      headers: defaultHeaders,
      data: body,
    });
  } catch (error) {
    if (error.response && error.response.status !== 401) {
      return error.response;
    }
    return {
      status: 401,
    };
  }
};

export const get = (path, query = {}, headers = {}, endpoint) =>
  FetchAPI(`${path}?${stringify(query)}`, "GET", headers, null, endpoint);

export const post = (path, body, headers, endpoint) =>
  FetchAPI(path, "POST", headers, body, endpoint);

export const put = (path, body, headers, endpoint) =>
  FetchAPI(path, "PUT", headers, body, endpoint);

export const destroy = (path, body, headers, endpoint) =>
  FetchAPI(path, "DELETE", headers, body, endpoint);
export const dele = (path, query = {}, headers = {}, endpoint) =>
  FetchAPI(`${path}?${stringify(query)}`, "DELETE", headers, null, endpoint);

