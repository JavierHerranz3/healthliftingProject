import { Injectable } from '@angular/core';
import { apiUrl } from '../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Athlete } from '../../../core/models/athlete.model';
import { Appointment } from '../../../core/models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AthleteService {
  private _apiUrl = apiUrl + '/athletes';

  constructor(private _http: HttpClient) {}

  getAthletes(page: number, size: number): Observable<Page<Athlete>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<Athlete>>(this._apiUrl, { params });
  }

  getAthleteById(id: string): Observable<Athlete> {
    return this._http.get<Athlete>(`${this._apiUrl}/${id}`);
  }

  getAthletesByNameAndSurname(
    name: string,
    surname: string
  ): Observable<Athlete[]> {
    return this._http.get<Athlete[]>(
      `${this._apiUrl}?name=${name}&surname=${surname}`
    );
  }

  getAppointmentsByAthleteId(athleteId: string): Observable<Appointment[]> {
    return this._http.get<Appointment[]>(
      `${this._apiUrl}/${athleteId}/appointments`
    );
  }

  createAthlete(athlete: Athlete): Observable<Athlete> {
    return this._http.post<Athlete>(this._apiUrl, athlete);
  }

  deleteAthlete(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
