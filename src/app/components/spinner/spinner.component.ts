import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  constructor(public loader: LoaderService, private authService: AuthService, private personService: PersonService) { }

  ngOnInit(): void {

  }
}
