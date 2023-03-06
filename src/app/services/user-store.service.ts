import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private idNumber$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }

  public setRoleForStore(role: string){
    this.role$.next(role);
  }

  public getIdNumberFromStore(){
    return this.idNumber$.asObservable();
  }

  public setIdNumberForStore(idNumber: string){
    this.idNumber$.next(idNumber);
  }
}
