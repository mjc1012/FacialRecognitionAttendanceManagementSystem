import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceLog } from 'src/app/models/attendancelog';
import { Employee } from 'src/app/models/employee';
import { Person } from 'src/app/models/person';
import { AttendanceLogService } from 'src/app/services/attendance-log.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PersonService } from 'src/app/services/person.service';
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
  dateSubmitted: boolean = false

  public userLogs: AttendanceLog[] = [];
  public deleteEmployee: Employee = {}
  imageBaseUrl=environment.AttendaceManagementSystemAPIBaseUrl+'profilepictures/';

  constructor(private employeeService: EmployeeService, private personService: PersonService,private toast: NgToastService, private attendanceLogService: AttendanceLogService) { }

  ngOnInit(): void {
    this.getEmployees()
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

    public getEmployees(): void {
      this.employeeService.getEmployees().subscribe({
        next:(data) =>{
          if(data.status){
            this.employees = data.value
            this.filteredEmployees = this.filterEmployeesByValue()
          }else{
            this.employees = []
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onAddEmloyee(addForm: NgForm): void {
      const person: Person = {
        firstName: addForm.value.firstName,
        middleName: addForm.value.middleName,
        lastName: addForm.value.lastName,
        validIdNumber: addForm.value.employeeIdNumber
      }
      this.employeeService.addEmployee(addForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
            this.onAddPerson(person);
          }else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 3000})
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });

      addForm.reset();
    }

    public onAddPerson(person: Person): void{
      this.personService.addPerson(person).subscribe({
        next:(data) =>{
          if(data.status){
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

    getEmployeeToUpdate(employee: Employee){
      this.editEmployee = employee
    }

    public onUpdateEmloyee(editForm: NgForm): void {
      const person: Person = {
        firstName: editForm.value.firstName,
        middleName: editForm.value.middleName,
        lastName: editForm.value.lastName,
        validIdNumber: editForm.value.employeeIdNumber
      }
      this.employeeService.updateEmployee(editForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
            this.onUpdatePerson(person);
          }else{
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

    getEmployeeToDelete(employee: Employee){
      this.deleteEmployee = employee
    }

    public onDeleteEmloyee(employee: Employee): void {
      this.employeeService.deleteEmployee(employee.id!).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
            this.onDeletePerson(employee.employeeIdNumber!);
          }else{
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
}
