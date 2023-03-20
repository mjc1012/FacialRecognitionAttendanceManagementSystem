export interface Person{
  id?: number,
  pairId?: string,
  firstName?: string,
  middleName?: string,
  lastName?: string,
  password?: string,
  accessToken?: string,
  refreshToken?: string,
  refreshTokenExpiryTime?: Date
}
