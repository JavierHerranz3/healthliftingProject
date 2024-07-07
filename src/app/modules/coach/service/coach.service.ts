import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Coach } from '../../../core/models/coach.model';
import { apiUrl } from '../../../enviroment';
import { Appointment } from '../../../core/models/appointment.model';
import { Page } from '../../../core/models/page.model';

@Injectable({
  providedIn: 'root',
})
export class CoachService {
  private _apiUrl = apiUrl + '/coaches'; // Ajusta la URL según tu backend

  constructor(private _http: HttpClient) {}

  getCoaches(page: number, size: number): Observable<Page<Coach>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<Coach>>(this._apiUrl, { params });
  }

  getCoachById(id: string): Observable<Coach> {
    return this._http.get<Coach>(`${this._apiUrl}/${id}`);
  }
  getAppointmentsByCoachId(id: string): Observable<Appointment[]> {
    return this._http.get<Appointment[]>(
      `${this._apiUrl}/appointments/coaches/${id}`
    );
  }

  searchCoachesByDocument(document: string): Observable<Coach[]> {
    return this._http.get<Coach[]>(
      `${this._apiUrl}/search?document=${document}`
    );
  }

  createCoach(coach: Coach): Observable<Coach> {
    return this._http.post<Coach>(this._apiUrl, coach);
  }

  updateCoach(id: string, coach: Coach): Observable<Coach> {
    return this._http.patch<Coach>(`${this._apiUrl}/${id}`, coach);
  }

  deleteCoach(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}
