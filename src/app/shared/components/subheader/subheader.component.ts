import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-subheader',
  standalone: true,
  templateUrl: './subheader.component.html',
  styleUrl: './subheader.component.css',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SharedModule,
  ],
})
export class SubheaderComponent {
  constructor(private _router: Router) {}

  navigateToCreateAthlete() {
    this._router.navigate(['/athletes/create-athlete']);
  }
  navigateToCreateCoach() {
    this._router.navigate(['coaches/create-coach']);
  }
  navigateToCreateAppointment() {
    this._router.navigate(['appointments/create-appointment']);
  }
}
