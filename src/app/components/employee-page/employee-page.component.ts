import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceLog } from 'src/app/models/attendancelog';
import { DeleteRange } from 'src/app/models/deleteRange';
import { Employee } from 'src/app/models/employee';
import { Person } from 'src/app/models/person';
import { AttendanceLogService } from 'src/app/services/attendance-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { FaceRecognitionService } from 'src/app/services/face-recognition.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.css']
})
export class EmployeePageComponent implements OnInit {
  public employees: Employee[] = [];
  public filteredEmployees: Employee[] = [];
  public editEmployee: Employee = {}
  public absencesEmployee: Employee = {}
  imageFile?:File;
  _firstNameFilter: string = ""
  _middleNameFilter: string = ""
  _lastNameFilter: string = ""
  _emailFilter: string = ""
  _idNumberFilter: string = ""
  _roleFilter: string = ""
  public doFilter: boolean = false
  startDate!: Date
  endDate!: Date
  missedTimeInCount: number = 0
  missedTimeOutCount: number = 0
  WithinWorkTimeCount = 0
  dateSubmitted: boolean = false
  deleteAll = false
  canDeleteEmployees = false
  employeeLoggedIn: Employee = { };
  public employeeId: string = "";

  public userLogs: AttendanceLog[] = [];
  public deleteEmployee: Employee = {}
  imageBaseUrl=environment.AttendaceManagementSystemAPIBaseUrl+'profilepictures/';

  constructor(private employeeService: EmployeeService, private toast: NgToastService, private attendanceLogService: AttendanceLogService,
    private faceRecognitionService: FaceRecognitionService, private userStoreService: UserStoreService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userStoreService.getEmployeeIdFromStore().subscribe(val=>{
      const employeeIdFromToken = this.authService.getEmployeeIdFromToken();
      this.employeeId = val || employeeIdFromToken
    })
    this.getEmployees()
  }



  OnTrainModel(){
    this.faceRecognitionService.trainModel().subscribe({
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

  checkToDelete(){
    this.canDeleteEmployees = this.filteredEmployees.some(employee => employee.toDelete === true)
  }

  ToggleFilter(){
    this.doFilter = !this.doFilter
  }

  get firstNameFilter(){
    return this._firstNameFilter
  }

  set firstNameFilter(value: string){
    this._firstNameFilter = value
    this.filteredEmployees = this.filterEmployeesByValue()
  }

  get middleNameFilter(){
    return this._middleNameFilter
  }

  set middleNameFilter(value: string){
    this._middleNameFilter = value
    this.filteredEmployees = this.filterEmployeesByValue()
  }

  get lastNameFilter(){
    return this._lastNameFilter
  }

  set lastNameFilter(value: string){
    this._lastNameFilter = value
    this.filteredEmployees = this.filterEmployeesByValue()
  }

  get idNumberFilter(){
    return this._idNumberFilter
  }

  set idNumberFilter(value: string){
    this._idNumberFilter = value
    this.filteredEmployees = this.filterEmployeesByValue()
  }

  get roleFilter(){
    return this._roleFilter
  }

  set roleFilter(value: string){
    this._roleFilter = value
    this.filteredEmployees = this.filterEmployeesByValue()
  }

  get emailFilter(){
    return this._emailFilter
  }

  set emailFilter(value: string){
    this._emailFilter = value
    this.filteredEmployees = this.filterEmployeesByValue()
  }


  filterEmployeesByValue(){
    if(this._firstNameFilter === "" && this._middleNameFilter === "" && this._lastNameFilter === "" && this._emailFilter === "" &&
    this._idNumberFilter === "" && this._roleFilter === ""){
      return this.employees;
    }
    else{
      return this.employees.filter((employee) =>{
        return ((this._roleFilter === "")? true : employee.employeeRoleName?.toLowerCase() === this._roleFilter.toLowerCase()) &&
        ((this._firstNameFilter === "")? true : employee.firstName?.toLowerCase() === this._firstNameFilter.toLowerCase()) &&
        ((this._middleNameFilter === "")? true : employee.middleName?.toLowerCase() === this._middleNameFilter.toLowerCase()) &&
        ((this._lastNameFilter === "")? true : employee.lastName?.toLowerCase() === this._lastNameFilter.toLowerCase()) &&
        ((this._emailFilter === "")? true : employee.emailAddress?.toLowerCase() === this._emailFilter.toLowerCase()) &&
        ((this._idNumberFilter === "")? true : employee.employeeIdNumber?.toLowerCase() === this._idNumberFilter.toLowerCase())
      })
    }
  }

  selectAllForDelete(){
    this.deleteAll = !this.deleteAll
    this.filteredEmployees.forEach((employee) =>{
      if(employee.employeeIdNumber != this.employeeId) employee.toDelete = this.deleteAll
    })

    this.canDeleteEmployees = this.filteredEmployees.some(employee => employee.toDelete === true)
  }

  onDeleteEmployees(){
    const employeeIds = this.filteredEmployees.filter(employee => employee.toDelete == true).map(employee => employee.id)
    const deleteRange: DeleteRange = {
      ids: employeeIds
    }

    this.employeeService.deleteEmployees(deleteRange).subscribe({
      next:(data) =>{
        if(data.status){
          this.getEmployees();
          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
        }else{
          this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
        }
      },
      error:(e)=>{
        this.toast.error({detail: "ERROR", summary: e, duration: 2000})
      }
    });
  }

    public getEmployees(): void {
      this.employeeService.getEmployees().subscribe({
        next:(data) =>{
          if(data.status){
            this.employees = data.value
            this.filteredEmployees = this.filterEmployeesByValue()
          }else{
            this.employees = []
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
    }

    onChange(event:any){
      this.imageFile=event.target.files[0];
     }


    public onAddEmloyee(addForm: NgForm): void {
      let formData = new FormData();
      formData.append("firstName",addForm.value.firstName??"");
      formData.append("middleName",addForm.value.middleName??"");
      formData.append("lastName",addForm.value.lastName??"");
      formData.append("emailAddress",addForm.value.emailAddress??"");
      formData.append("employeeIdNumber",addForm.value.employeeIdNumber??"");
      formData.append("employeeRoleName",addForm.value.employeeRoleName??"");
      formData.append("imageFile",this.imageFile??"");
      this.employeeService.addEmployee(formData).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
      this.imageFile = undefined

      addForm.reset();
    }

    getEmployeeToUpdate(employee: Employee){
      this.editEmployee = employee
    }

    public onUpdateEmloyee(editForm: NgForm): void {
      let formData = new FormData();
      formData.append("id",editForm.value.id??"");
      formData.append("firstName",editForm.value.firstName??"");
      formData.append("middleName",editForm.value.middleName??"");
      formData.append("lastName",editForm.value.lastName??"");
      formData.append("emailAddress",editForm.value.emailAddress??"");
      formData.append("employeeIdNumber",editForm.value.employeeIdNumber??"");
      formData.append("employeeRoleName",editForm.value.employeeRoleName??"");
      formData.append("imageFile",this.imageFile??"");
      console.log(formData)
      this.employeeService.updateEmployee(formData).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
      this.imageFile = undefined
      editForm.reset()
    }

    getEmployeeToDelete(employee: Employee){
      this.deleteEmployee = employee
    }

    public onDeleteEmloyee(employee: Employee): void {
      this.employeeService.deleteEmployee(employee.id!).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
    }

  getEmployeeToGetAbsences(employee: Employee){
    this.dateSubmitted = false
    this.absencesEmployee = employee
  }


  public onCloseAbsences(){
    this.dateSubmitted = false
  }

  public getUserAbsencesCount(DateForm: NgForm): void {
    var startDate = new Date(DateForm.value.startDate)
    var endDate = new Date(DateForm.value.endDate)
    this.attendanceLogService.getAllForUser(this.absencesEmployee.id!).subscribe({
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
          var WithinWorkTime = data.value.filter((item: AttendanceLog) => {
            var d = new Date(item.timeLog!.split(" ")[0])
            return d.getTime() >= startDate.getTime() && d.getTime() <= endDate.getTime() && item.attendanceLogStateName == "Within Work Time"
          });
          this.missedTimeInCount = AbsentTimeIn.length
          this.missedTimeOutCount = AbsentTimeOut.length
          this.WithinWorkTimeCount = WithinWorkTime.length
        }
        this.dateSubmitted = true
      },
      error:(e)=>{
        this.toast.error({detail: "ERROR", summary: e, duration: 2000})
      }
    });
    DateForm.reset()
  }
}
