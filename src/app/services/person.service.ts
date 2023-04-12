import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FaceToRecognize } from '../models/facetorecognize';
import { Person } from '../models/person';
import { ResponseApi } from '../models/response-api';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private baseUrl = environment.AttendaceManagementSystemAPIBaseUrl + 'api/Person';

  constructor(private http:HttpClient) { }

  getPerson(id: number): Observable<ResponseApi>{
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<ResponseApi>(url);
  }
}
