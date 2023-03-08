import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AttendanceLog } from 'src/app/models/attendancelog';
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
  _timeLogFilter: string = ""
  _attendanceLogTypeNameFilter: string = ""
  _employeeIdNumberFilter: string = ""
  _employeeNameFilter: string = ""
  _attendanceLogStatusNameFilter: string = ""
  public doFilter: boolean = false
  startDate!: Date
  endDate!: Date
  employees: Employee[] = []

  constructor(private attendanceLogService: AttendanceLogService, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getLogs()
    this.getEmployees()
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next:(data) =>{
        if(data.status){
          this.employees = data.value

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

  get employeeNameFilter(){
    return this._employeeNameFilter
  }

  set employeeNameFilter(value: string){
    this._employeeNameFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  get attendanceLogStatusNameFilter(){
    return this._attendanceLogStatusNameFilter
  }

  set attendanceLogStatusNameFilter(value: string){
    this._attendanceLogStatusNameFilter = value
    this.filteredLogs = this.filterLogsByValue()
  }

  filterLogsByValue(){
    if(this._timeLogFilter === "" && this._attendanceLogTypeNameFilter === "" && this._employeeIdNumberFilter === "" && this._employeeNameFilter === "" && this._attendanceLogStatusNameFilter === ""){
      return this.logs;
    }
    else{
      return this.logs.filter((log) =>{
        return ((this._timeLogFilter === "")? true : log.timeLog?.split(" ")[0].toLowerCase() === this._timeLogFilter.toLowerCase()) &&
        ((this._attendanceLogTypeNameFilter === "")? true : log.attendanceLogTypeName?.toLowerCase() === this._attendanceLogTypeNameFilter.toLowerCase()) &&
        ((this._employeeIdNumberFilter === "")? true : log.employeeIdNumber?.toLowerCase() === this._employeeIdNumberFilter.toLowerCase()) &&
        ((this._employeeNameFilter === "")? true : log.employeeName?.toLowerCase() === this._employeeNameFilter.toLowerCase()) &&
        ((this._attendanceLogStatusNameFilter === "")? true : log.attendanceLogStatusName?.toLowerCase() === this._attendanceLogStatusNameFilter.toLowerCase())
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
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public removeDateFilter(){
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
      this.attendanceLogService.add(addForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            console.log(data.message)
            this.getLogs();
            addForm.reset();
          }
        },
        error:(e)=>{
          console.log(e);
          addForm.reset();
        }
      });
    }

    getLogToUpdate(log: AttendanceLog){
      this.editLog = log
    }

    public onUpdateLog(editForm: NgForm): void {
      this.attendanceLogService.update(editForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            console.log(data.message)
            this.getLogs();
          }
        },
        error:(e)=>{
          console.log(e);
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
            console.log(data.message)
            this.getLogs();
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    RecordAbsences(){
      this.employeeService.recordAbsences(this.formatDate(new Date())).subscribe({
        next:(data) =>{
          if(data.status){
            this.getLogs();
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
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
