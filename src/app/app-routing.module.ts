import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { AttendancePageComponent } from './components/attendance-page/attendance-page.component';
import { EmployeePageComponent } from './components/employee-page/employee-page.component';
import { FaceCollectionPageComponent } from './components/face-collection-page/face-collection-page.component';
import { FaceRecognitionPageComponent } from './components/face-recognition-page/face-recognition-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ResetPasswordPageComponent } from './components/reset-password-page/reset-password-page.component';
import { UserAttendancePageComponent } from './components/user-attendance-page/user-attendance-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  {
    path: 'face-recognition',
    component: FaceRecognitionPageComponent
  },
  {
    path: 'user-attendance-log-list',
    component: UserAttendancePageComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'face-collection',
    component: FaceCollectionPageComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'employee-list',
    component: EmployeePageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'attendance-log-list',
    component: AttendancePageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reset',
    component: ResetPasswordPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/face-recognition',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
