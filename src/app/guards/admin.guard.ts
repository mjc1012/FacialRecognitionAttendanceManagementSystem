import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../services/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private userStoreService: UserStoreService, private router: Router, private toast: NgToastService){}

  canActivate(): boolean {
    if(this.authService.isLoggedIn()){
      let role;
      this.userStoreService.getRoleFromStore().subscribe(val=>{
        const roleFromToken = this.authService.getRoleFromToken();
        role = val || roleFromToken
      });
      if(role === 'Admin'){
        return true;
      }
      else{
        this.router.navigate(['account'])
        this.toast.warning({detail: "WARNING", summary: "Only Admin is Allowed!", duration: 3000});
        return false;
      }
    }
    else {
      this.router.navigate(['login'])
      this.toast.error({detail: "ERROR", summary: "Please Login First!", duration: 3000});
      return false;
    }
  }

}
