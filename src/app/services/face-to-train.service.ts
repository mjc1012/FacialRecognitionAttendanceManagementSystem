import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee';
import { FaceToTrain } from '../models/facetotrain';
import { Person } from '../models/person';
import { ResponseApi } from '../models/response-api';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class FaceToTrainService {
  private baseUrl = environment.AttendaceManagementSystemAPIBaseUrl + 'api/FaceToTrain';
  constructor(private http:HttpClient) { }

  getAll(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(this.baseUrl);
  }

  getMissingExpression(employee: Employee): Observable<ResponseApi>{
    const url = `${this.baseUrl}/${employee.id}/missing-expression`;
    return this.http.get<ResponseApi>(url);
  }

  getFacesByEmployeeId(employee: Employee): Observable<ResponseApi>{
    const url = `${this.baseUrl}/${employee.id}/person-faces`;
    return this.http.get<ResponseApi>(url);
  }

  add(request: FaceToTrain): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(this.baseUrl, request);
  }

  delete(id: number){
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<ResponseApi>(url);
  }
}
