export interface GetMemberReq {
  memberId: number;
}

export interface GetMemberRes {
  memberId: number;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  memberDepartment: string;
  memberPosition: string;
  memberPhone: string;
  memberAddress: string;
  memberBirthday: string;
  memberGender: string;
  memberJoinDate: string;
}

export interface DeleteMemberReq {
  memberId: number;
}

export interface CreateMemberReq {
  memberName: string;
  memberEmail: string;
  memberRole: string;
  memberDepartment: string;
  memberPosition: string;
  memberPhone: string;
  memberAddress: string;
}

export interface UpdateMemberReq {
  memberId: number;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  memberDepartment: string;
}



