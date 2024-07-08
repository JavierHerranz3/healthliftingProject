import { Injectable } from '@angular/core';
import { apiUrl } from '../../../enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Athlete } from '../../../core/models/athlete.model';
import { Appointment } from '../../../core/models/appointment.model';
import { Page } from '../../../core/models/page.model';
import { TrainingSheet } from '../../../core/models/trainingSheet.model';
import { Coach } from '../../../core/models/coach.model';

@Injectable({
  providedIn: 'root',
})
export class AthleteService {
  getCoachById(coachId: string): Observable<Coach> {
    return this._http.get<Coach>(`${this._apiUrl}/${coachId}`);
  }
  private _apiUrl = apiUrl + '/athletes';

  constructor(private _http: HttpClient) {}

  getAthletes(page: number, size: number): Observable<Page<Athlete>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<Athlete>>(this._apiUrl, { params });
  }

  searchAthleteByDocument(document: string): Observable<Athlete> {
    return this._http.get<Athlete>(`${this._apiUrl}/list/${document}`);
  }

  getAthleteById(id: string): Observable<Athlete> {
    return this._http.get<Athlete>(`${this._apiUrl}/${id}`);
  }

  getAppointmentById(appointmentId: string): Observable<Appointment> {
    return this._http.get<Appointment>(
      `${this._apiUrl}/appointments/${appointmentId}`
    );
  }
  getAppointmentsByAthleteId(
    athleteId: string,
    page: number,
    size: number
  ): Observable<Page<Appointment>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<Appointment>>(
      `${apiUrl}/appointments/athletes/${athleteId}`,
      { params }
    );
  }

  getTrainingSheetsByAthleteId(
    athleteId: string,
    page: number,
    size: number
  ): Observable<Page<TrainingSheet>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<TrainingSheet>>(
      `${apiUrl}/trainingsheets/athletes/${athleteId}`,
      { params }
    );
  }

  createAthlete(athlete: Athlete): Observable<Athlete> {
    return this._http.post<Athlete>(this._apiUrl, athlete);
  }

  updateAthlete(id: string, athlete: Athlete): Observable<Athlete> {
    return this._http.patch<Athlete>(`${this._apiUrl}/${id}`, athlete);
  }

  deleteAthlete(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}

export { Page };
