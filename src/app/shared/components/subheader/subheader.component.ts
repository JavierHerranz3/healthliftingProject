import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../shared.module';
import { filter } from 'rxjs';

@Component({
  selector: 'app-subheader',
  standalone: true,
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.css'],
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SharedModule,
  ],
})
export class SubheaderComponent implements OnInit {
  showAthleteButton = false;
  showCoachButton = false;
  showAppointmentButton = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this._router.url;
        this.showAthleteButton = url.includes('athlete');
        this.showCoachButton = url.includes('coach');
        this.showAppointmentButton = url.includes('appointments');
      });
  }

  navigateToCreateAthlete() {
    this._router.navigate(['/athletes/create-athlete']);
  }

  navigateToCreateCoach() {
    this._router.navigate(['/coaches/create-coach']);
  }

  navigateToCreateAppointment() {
    this._router.navigate(['/appointments/create-appointment']);
  }
}
