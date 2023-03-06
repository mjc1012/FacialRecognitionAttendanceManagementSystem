import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public role: string = ""

  constructor(private authService: AuthService, private userStoreService: UserStoreService) { }

  ngOnInit(): void {
    this.userStoreService.getRoleFromStore().subscribe(val=>{
      const roleFromToken = this.authService.getRoleFromToken()
      this.role = val || roleFromToken
    })
  }

  logout(){
    this.authService.logout();
  }

  isLoggedin(): boolean{
    return this.authService.isLoggedIn();
  }
}
