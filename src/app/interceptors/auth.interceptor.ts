import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { PersonService } from '../services/person.service';
import { ResponseApi } from '../models/response-api';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private toast: NgToastService, private router: Router, private personService: PersonService
  ) {}

  handleUnauthorizedTokenAttendanceApi(req: HttpRequest<any>, next: HttpHandler){
    const token = {
      accessToken:  this.authService.getToken()!,
      refreshToken: this.authService.getRefreshToken()!
    }
    return this.authService.renewToken(token).pipe(
      switchMap((data: ResponseApi)=>{
        this.authService.storeRefreshToken(data.value.refreshToken)
        this.authService.storeToken(data.value.accessToken)
        req = req.clone({
          setHeaders: {Authorization:`Bearer ${this.authService.getToken()}`}
        })
        return next.handle(req);
      }),
      catchError((err)=>{
        return throwError(()=>{
          this.toast.warning({detail: "WARNING", summary:"Token is expired, Please Login again", duration: 3000})
            this.router.navigate(['login'])
            this.authService.logout();
        })
      })
    )
  }

  handleUnauthorizedTokenFaceApi(req: HttpRequest<any>, next: HttpHandler){
    const secondaryToken = {
      accessToken:  this.personService.getToken()!,
      refreshToken: this.personService.getRefreshToken()!
    }
    return this.personService.renewToken(secondaryToken).pipe(
      switchMap((data: ResponseApi)=>{
        this.personService.storeRefreshToken(data.value.refreshToken)
        this.personService.storeToken(data.value.accessToken)

        req = req.clone({
          setHeaders: {Authorization:`Bearer ${this.personService.getToken()}`}
        })

        console.log(req.headers)
        return next.handle(req);
      }),
      catchError((err)=>{
        return throwError(()=>{
          this.toast.warning({detail: "WARNING", summary:"Token is expired, Please Login again", duration: 3000})
            this.router.navigate(['login'])
            this.authService.logout();
        })
      })
    )
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('caught')
    const myToken = this.authService.getToken();
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${myToken}`}
      })
    }


    return next.handle(request).pipe(

      catchError((error: any) => {
        if(error instanceof HttpErrorResponse){
          if(error.status === 401){
            const errorUrl = error.url!.split("api")[0]
            if(errorUrl == environment.AttendaceManagementSystemAPIBaseUrl) return this.handleUnauthorizedTokenAttendanceApi(request, next);
            if(errorUrl == environment.FaceRecongtionAPIBaseUrl)return this.handleUnauthorizedTokenFaceApi(request, next);
          }
        }
        return throwError(() => new Error("Some other error occured"));
      })

    );
  }
}
