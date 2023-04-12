import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceLog } from 'src/app/models/attendancelog';
import { DeleteRange } from 'src/app/models/deleteRange';
import { Employee } from 'src/app/models/employee';
import { AttendanceLogService } from 'src/app/services/attendance-log.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.css']
})
export class AttendancePageComponent implements OnInit {
  public logs: AttendanceLog[] = [];
  public filteredLogs: AttendanceLog[] = [];
  public editLog: AttendanceLog = {
  }

  public deleteLog: AttendanceLog = {
  }
  imageBaseUrl=environment.AttendaceManagementSystemAPIBaseUrl+'attendancepictures/';
  _timeLogFilter: string = ""
  _attendanceLogTypeNameFilter: string = ""
  _employeeIdNumberFilter: string = ""
  _attendanceLogStatusNameFilter: string = ""
  _attendanceLogStateNameFilter: string = ""
  _firstNameFilter: string = ""
  _middleNameFilter: string = ""
  _lastNameFilter: string = ""
  public doFilter: boolean = false
  startDate!: Date
  endDate!: Date
  employees: Employee[] = []
  deleteAll = false
  canDeleteLogs = false

  constructor(private attendanceLogService: AttendanceLogService, private employeeService: EmployeeService, private toast: NgToastService) { }

  ngOnInit(): void {
    this.getLogs()
  }

  checkToDelete(){
    this.canDeleteLogs = this.filteredLogs.some(log => log.toDelete === true)
  }


  selectAllForDelete(){
    this.deleteAll = !this.deleteAll
    this.filteredLogs.forEach((log) =>{
      log.toDelete = this.deleteAll
    })
    this.canDeleteLogs = this.filteredLogs.some(log => log.toDelete === true)
  }

  onDeleteLogs(){
    const ids = this.filteredLogs.filter(log => log.toDelete == true).map(log => log.id)
    const deleteRange: DeleteRange = {
      ids: ids
    }
    this.attendanceLogService.deleteLogs(deleteRange).subscribe({
      next:(data) =>{
        if(data.status){
          this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
        }else{
          this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
        }
        this.getLogs();
      },
      error:(e)=>{
        this.toast.error({detail: "ERROR", summary: e, duration: 2000})
      }
    });
  }

  ToggleFilter(){
    this.doFilter = !this.doFilter
  }

  get timeLogFilter(){
    return this._timeLogFilter
  }

  set timeLogFilter(value: string){
    this._timeLogFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  get attendanceLogTypeNameFilter(){
    return this._attendanceLogTypeNameFilter
  }

  set attendanceLogTypeNameFilter(value: string){
    this._attendanceLogTypeNameFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  get employeeIdNumberFilter(){
    return this._employeeIdNumberFilter
  }

  set employeeIdNumberFilter(value: string){
    this._employeeIdNumberFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  get attendanceLogStatusNameFilter(){
    return this._attendanceLogStatusNameFilter
  }

  set attendanceLogStatusNameFilter(value: string){
    this._attendanceLogStatusNameFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  get attendanceLogStateNameFilter(){
    return this._attendanceLogStateNameFilter
  }

  set attendanceLogStateNameFilter(value: string){
    this._attendanceLogStateNameFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  get firstNameFilter(){
    return this._firstNameFilter
  }

  set firstNameFilter(value: string){
    this._firstNameFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  get middleNameFilter(){
    return this._middleNameFilter
  }

  set middleNameFilter(value: string){
    this._middleNameFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  get lastNameFilter(){
    return this._lastNameFilter
  }

  set lastNameFilter(value: string){
    this._lastNameFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  filterLogsByValue(){
    if(this._timeLogFilter === "" && this._attendanceLogTypeNameFilter === "" && this._employeeIdNumberFilter === "" &&  this._attendanceLogStatusNameFilter === "" &&
    this._firstNameFilter === "" && this._middleNameFilter === "" && this._lastNameFilter === "" &&  this._attendanceLogStateNameFilter === "" ){
      return this.logs;
    }
    else{
      return this.logs.filter((log) =>{
        return ((this._timeLogFilter === "")? true : log.timeLog?.split(" ")[0].toLowerCase() === this._timeLogFilter.toLowerCase()) &&
        ((this._attendanceLogTypeNameFilter === "")? true : log.attendanceLogTypeName?.toLowerCase() === this._attendanceLogTypeNameFilter.toLowerCase()) &&
        ((this._employeeIdNumberFilter === "")? true : log.employeeIdNumber?.toLowerCase() === this._employeeIdNumberFilter.toLowerCase()) &&
        ((this._firstNameFilter === "")? true : log.firstName?.toLowerCase() === this._firstNameFilter.toLowerCase()) &&
        ((this._middleNameFilter === "")? true : log.middleName?.toLowerCase() === this._middleNameFilter.toLowerCase()) &&
        ((this._lastNameFilter === "")? true : log.lastName?.toLowerCase() === this._lastNameFilter.toLowerCase()) &&
        ((this._attendanceLogStatusNameFilter === "")? true : log.attendanceLogStatusName?.toLowerCase() === this._attendanceLogStatusNameFilter.toLowerCase()) &&
        ((this._attendanceLogStateNameFilter === "")? true : log.attendanceLogStateName?.toLowerCase() === this._attendanceLogStateNameFilter.toLowerCase())
      })
    }
  }

    public getLogs(): void {
      this.attendanceLogService.getAll().subscribe({
        next:(data) =>{
          if(data.status){
            this.logs = data.value
            this.filteredLogs = this.filterLogsByValue()
          }
          else{
            this.logs = []
            this.filteredLogs = []
          }
          this.getEmployees()
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

          }else{
            this.employees = []
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
    }


    public removeDateFilter(filterDateForm: NgForm){
      filterDateForm.reset()
      this.filteredLogs = this.logs
    }

    public getLogsBetweenDates(filterDateForm: NgForm){
      var startDate = new Date(filterDateForm.value.startDate)
      var endDate = new Date(filterDateForm.value.endDate)
        this.filteredLogs = this.logs.filter((item: any) => {
          var d = new Date(item.timeLog.split(" ")[0])
          return d.getTime() >= startDate.getTime() && d.getTime() <= endDate.getTime()
      });
    }

    public onAddLog(addForm: NgForm): void {
      addForm.value.timeLog = addForm.value.timeLog.toString().replace("T", " ") + ":00"
      this.attendanceLogService.add(addForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.getLogs();
            this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
      addForm.reset();
    }



    getLogToUpdate(log: AttendanceLog){
      this.editLog = log
    }

    public onUpdateLog(editForm: NgForm): void {

      editForm.value.timeLog = editForm.value.timeLog.toString().replace("T", " ")
      this.attendanceLogService.update(editForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.getLogs();
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

    getLogToDelete(log: AttendanceLog){
      this.deleteLog = log
    }

    public onDeleteLog(id: number): void {
      this.attendanceLogService.delete(id).subscribe({
        next:(data) =>{
          if(data.status){
            this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
          }else{
            this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
          }
          this.getLogs();
        },
        error:(e)=>{
          this.toast.error({detail: "ERROR", summary: e, duration: 2000})
        }
      });
    }

    RecordAbsences(){
      this.employeeService.recordAbsences(this.formatDate(new Date())).subscribe({
        next:(data) =>{
          if(data.status){
            this.getLogs();
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

    padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }
    formatDate(date: Date) {
      return (
        [
          date.getFullYear(),
          this.padTo2Digits(date.getMonth() + 1),
          this.padTo2Digits(date.getDate()),
        ].join('-')
      );
    }


}
