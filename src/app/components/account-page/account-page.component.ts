import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceLog } from 'src/app/models/attendancelog';
import { Employee } from 'src/app/models/employee';
import { Person } from 'src/app/models/person';
import { AttendanceLogService } from 'src/app/services/attendance-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PersonService } from 'src/app/services/person.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  public idNumber: string = "";
  imageFile?:File;
  public employee: Employee = { };
  imageBaseUrl=environment.AttendaceManagementSystemAPIBaseUrl+'profilepictures/';
  startDate!: Date
  endDate!: Date
  missedTimeInCount: number = 0
  missedTimeOutCount: number = 0
  dateSubmitted: boolean = false
  public userLogs: AttendanceLog[] = [];
  public absencesEmployee: Employee = {}
  constructor(private employeeService: EmployeeService, private personService: PersonService, private authService: AuthService, private userStoreService: UserStoreService, private toast: NgToastService,
    private attendanceLogService: AttendanceLogService, private router: Router) { }



  ngOnInit(): void {
    this.userStoreService.getIdNumberFromStore().subscribe(val=>{
      const idNumberFromToken = this.authService.getIdNumberFromToken();
      this.idNumber = val || idNumberFromToken
    })

    this.getEmployee()
  }

    public getEmployee(): void {
      this.employeeService.getEmployee(this.idNumber).subscribe({
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
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onUpdateEmloyee(editForm: NgForm): void {
      const person: Person = {
        firstName: editForm.value.firstName,
        middleName: editForm.value.middleName,
        lastName: editForm.value.lastName,
        validIdNumber: editForm.value.employeeIdNumber
      }
      console.log(person)
      this.employeeService.updateEmployee(editForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.onUpdatePerson(person);
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 3000})
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onUpdatePerson(person: Person): void{
      this.personService.updatePerson(person).subscribe({
        next:(data) =>{
          if(data.status){
          this.getEmployee();
          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 3000})
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 3000})
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onUpdatePassword(editPasswordForm: NgForm): void {
      const person: Person = {
        validIdNumber: editPasswordForm.value.employeeIdNumber,
        password: editPasswordForm.value.password,
      }
      this.employeeService.updatePassword(editPasswordForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.onUpdateFaceApiPassword(person);
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 3000})
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
      editPasswordForm.reset();
    }

    public onUpdateFaceApiPassword(person: Person){
      this.personService.updatePassword(person).subscribe({
        next:(data) =>{
          if(data.status){
          this.getEmployee();

          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 3000})
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 3000})
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
    });
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

          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 3000})
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 3000})
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
      editProfileForm.reset();
    }

    public onDeleteEmloyee(employee: Employee): void {
      this.employeeService.deleteEmployee(employee.id!).subscribe({
        next:(data) =>{
          if(data.status){
            this.onDeletePerson(employee.employeeIdNumber!);
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 3000})
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onDeletePerson(validIdNumber: string): void{
      this.personService.deletePerson(validIdNumber).subscribe({
        next:(data) =>{
          if(data.status){
          this.logout()
          this.router.navigate(['login'])
          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 3000})
          }
          else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 3000})
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }


    getEmployeeToGetAbsences(employee: Employee){
      this.dateSubmitted = false
      this.absencesEmployee = employee
    }

    public getUserAbsencesCount(DateForm: NgForm): void {
      var startDate = new Date(DateForm.value.startDate)
      var endDate = new Date(DateForm.value.endDate)
      this.attendanceLogService.getAllForUser(this.absencesEmployee.employeeIdNumber!).subscribe({
        next:(data) =>{
          if(data.status){
            var TimeInLogs = data.value.filter((item: any) => {
              var d = new Date(item.timeLog.split(" ")[0])
              return d.getTime() >= startDate.getTime() && d.getTime() <= endDate.getTime() && item.attendanceLogTypeName == "TimeIn" && item.attendanceLogStatusName == "Absent"
          });
          var TimeOutLogs = data.value.filter((item: any) => {
            var d = new Date(item.timeLog.split(" ")[0])
            return d.getTime() >= startDate.getTime() && d.getTime() <= endDate.getTime() && item.attendanceLogTypeName == "TimeOut" && item.attendanceLogStatusName == "Absent"
        });
          this.missedTimeInCount = TimeInLogs.length
          this.missedTimeOutCount = TimeOutLogs.length
          this.dateSubmitted = true
          }
          else{
            this.userLogs = []
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
      DateForm.reset()
    }

    logout(){
      this.authService.logout();
    }

}
