// 공통 API 응답 포맷
export interface ApiResponse<T> {
  code: number;    // 성공 여부
  message?: string;    // 에러/성공 메시지
  data: T;             // 응답 데이터
}
