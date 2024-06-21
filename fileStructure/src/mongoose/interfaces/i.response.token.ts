export interface IResponseToken {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: number; // in days
  accessTokenExpiresIn: number; // in hours
}

export interface IQuery {
  page?: number | 1;
  pageSize?: number | 20;
  search?: string;
}
