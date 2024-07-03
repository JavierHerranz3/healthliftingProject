import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AthleteModule } from './modules/athlete/athlete.module';
import { HttpClientModule } from '@angular/common/http';
import { SubheaderComponent } from './shared/components/subheader/subheader.component';
import { SharedModule } from './shared/components/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatToolbarModule,
    RouterModule,
    MatButtonModule,
    AthleteModule,
    HttpClientModule,
    SubheaderComponent,
    SharedModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'healthliftingCenter';

  constructor(private _authService: AuthService) {}
  ngOnInit(): void {
    this._checkAndSetUser();
  }

  private _checkAndSetUser() {
    const user = localStorage.getItem('user');
    if (user) {
      this._authService.setUser(JSON.parse(user));
    }
  }
}
