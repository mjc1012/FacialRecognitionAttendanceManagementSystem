export interface Employee{
  id?: number,
  firstName?: string,
  middleName?: string,
  lastName?: string,
  emailAddress?: string,
  employeeIdNumber?: string,
  employeeRoleName?: string,
  profilePictureImageName?: string,
  password?: string,
  token?: string,
  refreshToken?: string,
  refreshTokenExpiryTime?: Date,
  imageFile?:File
}

