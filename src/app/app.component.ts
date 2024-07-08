import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AthleteModule } from './modules/athlete/athlete.module';
import { HttpClientModule } from '@angular/common/http';
import { SubheaderComponent } from './shared/components/subheader/subheader.component';
import { SharedModule } from './shared/components/shared.module';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'healthliftingCenter';
  isWelcomePage: boolean = false; // o cualquier lógica para determinar la página actual

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isWelcomePage = this.router.url === '/home';
      }
    });
  }
  ngOnInit(): void {
    // Implementación del método ngOnInit
    console.log('AppComponent initialized');
  }
}
