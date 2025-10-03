import apiClient from "../../api/apiClient";
import { ApiResponse } from "../types/ApiResponse";
import {
  GetMemberReq,
  GetMemberRes,
  CreateMemberReq,
  UpdateMemberReq,
  DeleteMemberReq,
} from "../types/memberTypes";

class MemberService {
  // GET: 회원 조회
  async getMember(params?: GetMemberReq): Promise<ApiResponse<GetMemberRes>> {
    const url = `/member`;
    const response = await apiClient.get<ApiResponse<GetMemberRes>>(url, { params });
    return response.data;
  }

  // POST: 회원 생성
  async createMember(body: CreateMemberReq): Promise<ApiResponse<null>> {
    const url = `/member`;
    const response = await apiClient.post<ApiResponse<null>>(url, body);
    return response.data;
  }

  // PUT: 회원 수정
  async updateMember(body: UpdateMemberReq): Promise<ApiResponse<null>> {
    const url = `/member`;
    const response = await apiClient.put<ApiResponse<null>>(url, body);
    return response.data;
  }

  // DELETE: 회원 삭제
  async deleteMember(params: DeleteMemberReq): Promise<ApiResponse<null>> {
    const url = `/member`;
    const response = await apiClient.delete<ApiResponse<null>>(url, { params });
    return response.data;
  }
}

// ✅ 이렇게 인스턴스 생성 후 바로 사용 가능
export default new MemberService();
