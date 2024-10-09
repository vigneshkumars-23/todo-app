import axios, { AxiosResponse } from "axios";
import {BACKEND_URLS} from '../constants/APIUrls';
import { TodoRequestBody } from "../constants/Models";

const api = axios.create();

const errorHandling = (error: AxiosResponse) => {
    return error;
}


api.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('todoGoogleAccessToken');
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
      if (response.status !== 200) return errorHandling(response);
      return response.data;
    },
    (error) => {
      return errorHandling(error);
    }
);

export const googleSignInAPI = (googleAccessToken: string) => {
    const url = BACKEND_URLS.GOOGLE_SIGN_IN;
    return api.get(url, {
        headers: {Authorization : 'Bearer ' + googleAccessToken}
    });
};

export const updateTodosAPI = (requestBody: TodoRequestBody) => {
    const url = BACKEND_URLS.UPDATE_TODOS;
    return api.post(url, requestBody);
}