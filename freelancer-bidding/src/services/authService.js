import { base_url } from "./base_url"
import { commonApi } from "./commonApi"

//register user

export const registerApi=async(userdata)=>{
    return await commonApi("POST",`${base_url}/user/register`,userdata,"")
}

//login user
export const loginApi=async(data)=>{
    return await commonApi("POST",`${base_url}/user/login`,data,"")
}