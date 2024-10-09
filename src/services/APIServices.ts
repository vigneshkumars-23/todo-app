import { TodoRequestBody } from '../constants/Models';
import {googleSignInAPI, updateTodosAPI} from '../interceptor/axiosConfig'
export const googleSignIn = async (googleAccessToken: string) => {
    try{
        const response = await googleSignInAPI(googleAccessToken);
        return response;
    } catch(error){
        console.log("Google Sign In Error", error);
        throw error;
    }
}
export const updateTodos = async(requestBody: TodoRequestBody) => {
    try{
        const response = await updateTodosAPI(requestBody);
        return response;
    } catch(error){
        console.log("Update Todo Error", error);
        throw error;
    }
}
