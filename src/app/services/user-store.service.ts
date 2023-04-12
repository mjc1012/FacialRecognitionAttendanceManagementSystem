import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private employeeId$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }

  public setRoleForStore(role: string){
    this.role$.next(role);
  }

  public getEmployeeIdFromStore(){
    return this.employeeId$.asObservable();
  }

  public setEmployeeIdForStore(employeeId: string){
    this.employeeId$.next(employeeId);
  }
}
