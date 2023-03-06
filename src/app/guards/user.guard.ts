import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toast: NgToastService){}

  canActivate(): boolean {
    if(this.authService.isLoggedIn()){
      return true;
    }
    else {
      this.router.navigate(['login'])
      this.toast.error({detail: "ERROR", summary: "Please Login First!", duration: 3000});
      return false;
    }
  }

}
