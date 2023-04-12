import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceLog } from 'src/app/models/attendancelog';
import { Employee } from 'src/app/models/employee';
import { AttendanceLogService } from 'src/app/services/attendance-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  public employeeId: string = "";
  imageFile?:File;
  public employee: Employee = { };
  imageBaseUrl=environment.AttendaceManagementSystemAPIBaseUrl+'profilepictures/';
  startDate!: Date
  endDate!: Date
  missedTimeInCount: number = 0
  missedTimeOutCount: number = 0
  lateTimeInCount = 0
  earlyTimeOutCount = 0
  dateSubmitted: boolean = false
  public userLogs: AttendanceLog[] = [];
  public absencesEmployee: Employee = {}
  newPassword = ""
  samePassword = false
  constructor(private employeeService: EmployeeService, private authService: AuthService, private userStoreService: UserStoreService, private toast: NgToastService,
    private attendanceLogService: AttendanceLogService, private router: Router) { }



  ngOnInit(): void {
    this.userStoreService.getEmployeeIdFromStore().subscribe(val=>{
      const employeeIdFromToken = this.authService.getEmployeeIdFromToken();
      this.employeeId = val || employeeIdFromToken
    })

    this.getEmployee()
  }

  set password(value: string){
    this.newPassword = value
  }

  checkPassword(value: string){
      this.samePassword = value === this.newPassword
  }

    public getEmployee(): void {
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next:(data) =>{
          if(data.status){
            this.employee = data.value
          }else{
            this.employee = {
              firstName: "",
              middleName: "",
              lastName: "",
              emailAddress: "",
              employeeIdNumber: "",
              employeeRoleName: ""
            }
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
    }

    public onUpdateEmloyee(editForm: NgForm): void {

      this.employeeService.updateEmployee(editForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployee()
            this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
    }



    public onUpdatePassword(editPasswordForm: NgForm): void {
      this.employeeService.updatePassword(editPasswordForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
      editPasswordForm.reset();
    }



    onChange(event:any){
      this.imageFile=event.target.files[0];
     }

    public onUpdateProfilePicture(editProfileForm: NgForm): void {

      let formData = new FormData();
      formData.append("employeeIdNumber",editProfileForm.value.employeeIdNumber??"");
      formData.append("imageFile",this.imageFile??"");
      this.employeeService.updateProfilePicture(formData).subscribe({
        next:(data) =>{
          if(data.status){
          this.getEmployee();

          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
      editProfileForm.reset();
    }

    public onDeleteEmloyee(employee: Employee): void {
      this.employeeService.deleteEmployee(employee.id!).subscribe({
        next:(data) =>{
          if(data.status){
            this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
    }
    public getUserAbsencesCount(DateForm: NgForm): void {
      var startDate = new Date(DateForm.value.startDate)
      var endDate = new Date(DateForm.value.endDate)
      this.attendanceLogService.getAllForUser(this.employee.id!).subscribe({
        next:(data) =>{
          if(data.status){
            var AbsentTimeIn = data.value.filter((item: AttendanceLog) => {
              var d = new Date(item.timeLog!.split(" ")[0])
              return d.getTime() >= startDate.getTime() && d.getTime() <= endDate.getTime() && item.attendanceLogTypeName == "TimeIn" && item.attendanceLogStatusName == "Absent"
          });
          var AbsentTimeOut = data.value.filter((item: AttendanceLog) => {
            var d = new Date(item.timeLog!.split(" ")[0])
            return d.getTime() >= startDate.getTime() && d.getTime() <= endDate.getTime() && item.attendanceLogTypeName == "TimeOut" && item.attendanceLogStatusName == "Absent"
        });
        var LateTimeIn = data.value.filter((item: AttendanceLog) => {
          var d = new Date(item.timeLog!.split(" ")[0])
          return d.getTime() >= startDate.getTime() && d.getTime() <= endDate.getTime() && item.attendanceLogTypeName == "TimeIn" && item.attendanceLogStateName == "Late"
        });
        var EarlyTimeOut = data.value.filter((item: AttendanceLog) => {
          var d = new Date(item.timeLog!.split(" ")[0])
          return d.getTime() >= startDate.getTime() && d.getTime() <= endDate.getTime() && item.attendanceLogTypeName == "TimeOut" && item.attendanceLogStateName == "Early"
        });

        this.missedTimeInCount = AbsentTimeIn.length
        this.missedTimeOutCount = AbsentTimeOut.length
        this.lateTimeInCount = LateTimeIn.length
        this.earlyTimeOutCount = EarlyTimeOut.length
          this.dateSubmitted = true
          }
          else{
            this.userLogs = []
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
      DateForm.reset()
    }

    logout(){
      this.authService.logout();
    }

}
