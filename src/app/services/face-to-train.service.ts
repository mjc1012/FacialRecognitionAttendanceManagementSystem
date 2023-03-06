import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  private baseUrl = environment.FaceRecongtionAPIBaseUrl + 'api/FaceToTrain';
  constructor(private http:HttpClient) { }

  getAll(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(this.baseUrl);
  }

  getMissingExpression(person: Person): Observable<ResponseApi>{
    const url = `${this.baseUrl}/${person.id}/missing-expression`;
    return this.http.get<ResponseApi>(url);
  }

  getFacesByPersonId(person: Person): Observable<ResponseApi>{
    const url = `${this.baseUrl}/${person.id}/person-faces`;
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
