import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AthleteService } from '../../athlete/service/athlete.service';
import { CoachService } from '../../coach/service/coach.service';
import { Appointment } from '../../../core/models/appointment.model';
import { apiUrl } from '../../../enviroment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private _apiUrl = apiUrl + '/appointments'; // Ajusta la URL según tu backend

  constructor(
    private http: HttpClient,
    private athleteService: AthleteService,
    private coachService: CoachService
  ) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this._apiUrl);
  }

  createAppointment(appointment: any): Observable<Appointment> {
    return this.http.post<any>(this._apiUrl, appointment);
  }
}
