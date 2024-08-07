import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AthleteService, Page } from '../../athlete/service/athlete.service';
import { CoachService } from '../../coach/service/coach.service';
import { Appointment } from '../../../core/models/appointment.model';
import { apiUrl } from '../../../enviroment';
import { Athlete } from '../../../core/models/athlete.model';
import { Coach } from '../../../core/models/coach.model';

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

  getAppointments(page: number, size: number): Observable<Page<Appointment>> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<Page<Appointment>>(this._apiUrl, { params });
  }
  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this._apiUrl}/${id}`);
  }
  getAthleteById(athleteId: string): Observable<Athlete> {
    return this.http.get<Athlete>(`${this._apiUrl}/athletes/${athleteId}`);
  }
  getAppointmentsByCoachDocument(
    document: string,
    page: number,
    size: number
  ): Observable<Page<Appointment>> {
    return this.http.get<Page<Appointment>>(
      `${this._apiUrl}/coaches/searchByDocument?document=${document}&page=${page}&size=${size}`
    );
  }
  getAppointmentsByAthleteId(
    id: string,
    pageable: any
  ): Observable<Page<Appointment>> {
    return this.http.get<Page<Appointment>>(
      `${apiUrl}/appointments/athletes/${id}`,
      { params: pageable }
    );
  }
  getAppointmentsByAthleteDocument(
    document: string,
    page: number,
    size: number
  ): Observable<Page<Appointment>> {
    return this.http.get<Page<Appointment>>(
      `${this._apiUrl}/athletes/searchByDocument?document=${document}&page=${page}&size=${size}`
    );
  }

  createAppointment(appointment: Appointment): Observable<any> {
    console.log('Creating appointment:', appointment);
    return this.http.post<any>(this._apiUrl, appointment);
  }

  updateAppointment(
    id: string,
    appointment: Partial<Appointment>
  ): Observable<any> {
    return this.http.patch<any>(`${this._apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete<any>(`${this._apiUrl}/${id}`);
  }
}
