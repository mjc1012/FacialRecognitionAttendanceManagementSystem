import { Component } from '@angular/core';
import { AttendanceLog } from 'src/app/models/attendancelog';
import { AttendanceLogService } from 'src/app/services/attendance-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-attendance-page',
  templateUrl: './user-attendance-page.component.html',
  styleUrls: ['./user-attendance-page.component.css']
})
export class UserAttendancePageComponent {
  public idNumber: string = "";
  public logs: AttendanceLog[] = [];
  public editLog: AttendanceLog = {
    timeLog: 'string',
    attendanceLogTypeName: 'string',
    employeeIdNumber: 'string',
  }

  public deleteLog: AttendanceLog = {
    timeLog: 'string',
    attendanceLogTypeName: 'string',
    employeeIdNumber: 'string',
  }
  imageBaseUrl=environment.AttendaceManagementSystemAPIBaseUrl+'attendancepictures/';

  constructor(private attendanceLogService: AttendanceLogService, private authService: AuthService, private userStoreService: UserStoreService) { }

  ngOnInit(): void {
    this.userStoreService.getIdNumberFromStore().subscribe(val=>{
      const idNumberFromToken = this.authService.getIdNumberFromToken();
      this.idNumber = val || idNumberFromToken
    })
    this.getLogs()
  }

    public getLogs(): void {
      this.attendanceLogService.getAllForUser(this.idNumber).subscribe({
        next:(data) =>{
          if(data.status){
            this.logs = data.value
            console.log(data.message + "asdfasd")
          }
          else{
            this.logs = []
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }
}
