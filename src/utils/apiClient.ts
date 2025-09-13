import axios, { AxiosInstance, AxiosHeaders, AxiosError } from "axios";

const BASE_URL: string = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: new AxiosHeaders({ "Content-Type": "application/json" }), // AxiosHeaders로 초기화
  withCredentials: true,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        // config.headers가 없으면 AxiosHeaders로 초기화
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        // AxiosHeaders 객체라면 set 사용
        if ("set" in config.headers) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }

      console.log("[API Request]", config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error("[API Request Error]", error);
      // Promise.reject는 반드시 Error 객체 전달
      return Promise.reject(new Error(error?.message || "Request error"));
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => {
      console.log("[API Response]", response.status, response.config.url);
      return response;
    },
    (error: AxiosError) => {
      const status = error.response?.status;

      if (status === 401) {
        console.error("[API Response] 401 Unauthorized");
        window.location.href = "/login";
      } else if (status === 403) {
        console.error("[API Response] 403 Forbidden");
        alert("권한이 없습니다.");
      } else {
        console.error(
            "[API Response Error]",
            error.response?.data || error.message
        );
      }

      return Promise.reject(new Error(error.message));
    }
);

export default apiClient;
