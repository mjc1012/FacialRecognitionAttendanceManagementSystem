import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  public pairId: string = "";
  public filteredLogs: AttendanceLog[] = [];
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
  _timeLogFilter: string = ""
  _attendanceLogTypeNameFilter: string = ""
  _attendanceLogStatusNameFilter: string = ""
  _attendanceLogStateNameFilter: string = ""
  public doFilter: boolean = false
  startDate!: Date
  endDate!: Date

  constructor(private attendanceLogService: AttendanceLogService, private authService: AuthService, private userStoreService: UserStoreService) { }

  ngOnInit(): void {
    this.userStoreService.getPairIdFromStore().subscribe(val=>{
      const pairIdFromToken = this.authService.getPairIdFromToken();
      this.pairId = val || pairIdFromToken
    })
    this.getLogs()
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

  get attendanceLogStateNameFilter(){
    return this._attendanceLogStateNameFilter
  }

  set attendanceLogStateNameFilter(value: string){
    this._attendanceLogStateNameFilter = value
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
    if(this._timeLogFilter === "" && this._attendanceLogTypeNameFilter === ""  && this._attendanceLogStatusNameFilter === "" &&   this._attendanceLogStateNameFilter === "" ){
      return this.logs;
    }
    else{
      return this.logs.filter((log) =>{
        return ((this._timeLogFilter === "")? true : log.timeLog?.split(" ")[0].toLowerCase() === this._timeLogFilter.toLowerCase()) &&
        ((this._attendanceLogTypeNameFilter === "")? true : log.attendanceLogTypeName?.toLowerCase() === this._attendanceLogTypeNameFilter.toLowerCase()) &&
        ((this._attendanceLogStatusNameFilter === "")? true : log.attendanceLogStatusName?.toLowerCase() === this._attendanceLogStatusNameFilter.toLowerCase())&&
        ((this._attendanceLogStateNameFilter === "")? true : log.attendanceLogStateName?.toLowerCase() === this._attendanceLogStateNameFilter.toLowerCase())
      })
    }
  }

    public getLogs(): void {
      this.attendanceLogService.getAllForUser(this.pairId).subscribe({
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
}
