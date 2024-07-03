import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AthleteService } from '../../athlete/service/athlete.service';
import { CoachService } from '../../coach/service/coach.service';
import { Appointment } from '../../../core/models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'api/appointments'; // Asegúrate de que esta URL sea correcta

  constructor(
    private http: HttpClient,
    private athleteService: AthleteService,
    private coachService: CoachService
  ) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }
}
