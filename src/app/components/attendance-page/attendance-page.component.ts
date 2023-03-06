import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AttendanceLog } from 'src/app/models/attendancelog';
import { AttendanceLogService } from 'src/app/services/attendance-log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.css']
})
export class AttendancePageComponent implements OnInit {
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

  constructor(private attendanceLogService: AttendanceLogService) { }

  ngOnInit(): void {
    this.getLogs()
  }

    public getLogs(): void {
      this.attendanceLogService.getAll().subscribe({
        next:(data) =>{
          if(data.status){
            this.logs = data.value
            console.log(data.message)
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

}
