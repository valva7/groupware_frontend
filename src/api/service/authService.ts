// src/api/authService.ts
import apiClient from "../../api/apiClient";
import {LoginReq, LoginRes} from "../types/authTypes";
import {ApiResponse} from "../types/ApiResponse";

class AuthService {
  async login(body: LoginReq): Promise<ApiResponse<LoginRes>> {
    const url = `/auth/login`;
    const response = await apiClient.post<ApiResponse<LoginRes>>(url, body);
    return response.data;
  }
}

export default new AuthService();
