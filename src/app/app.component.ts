import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AthleteModule } from './modules/athlete/athlete.module';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MatToolbarModule, RouterModule,
    MatButtonModule,AthleteModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'healthliftingCenter';

  constructor(private _authService: AuthService){

  }
  ngOnInit(): void {
  this._checkAndSetUser();
  }

  private _checkAndSetUser(){
    const user = localStorage.getItem('user');
    if(user){
      this._authService.setUser(JSON.parse(user));
    }
  }
}
