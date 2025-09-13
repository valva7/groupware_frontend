export interface LoginReq {
  memberId: string;
  password: string;
}

export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  roles: string[];
  profileImageUrl: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  roles: string[];
  profileImageUrl: string;
}
