import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FaceRecognitionStatus } from '../models/facerecognitionstatus';
import { ResponseApi } from '../models/response-api';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionStatusService {
  private baseUrl = environment.AttendaceManagementSystemAPIBaseUrl + 'api/FaceRecognitionStatus';
  constructor(private http:HttpClient) { }

  add(status: FaceRecognitionStatus): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(this.baseUrl, status);
  }
}
