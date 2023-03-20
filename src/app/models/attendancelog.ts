export interface AttendanceLog{
  id?: number,
  timeLog: string,
  imageName?: string,
  base64String?: string,
  attendanceLogStateName?: string,
  attendanceLogTypeName?: string,
  attendanceLogStatusName?: string,
  employeeIdNumber?: string,
  pairId?: string,
  firstName?: string,
  middleName?: string,
  lastName?: string,
  toDelete?: boolean
}
