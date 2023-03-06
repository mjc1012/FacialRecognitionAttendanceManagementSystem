import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { FaceRecognitionPageComponent } from './components/face-recognition-page/face-recognition-page.component';
import { FaceCollectionPageComponent } from './components/face-collection-page/face-collection-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmployeePageComponent } from './components/employee-page/employee-page.component';
import { AttendancePageComponent } from './components/attendance-page/attendance-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgToastModule } from 'ng-angular-popup';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ResetPasswordPageComponent } from './components/reset-password-page/reset-password-page.component';
import { UserAttendancePageComponent } from './components/user-attendance-page/user-attendance-page.component';
import { TrainModelComponent } from './components/train-model/train-model.component';

@NgModule({
  declarations: [
    AppComponent,
    FaceRecognitionPageComponent,
    FaceCollectionPageComponent,
    NavbarComponent,
    EmployeePageComponent,
    AttendancePageComponent,
    LoginPageComponent,
    SpinnerComponent,
    AccountPageComponent,
    ResetPasswordPageComponent,
    UserAttendancePageComponent,
    TrainModelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgToastModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
