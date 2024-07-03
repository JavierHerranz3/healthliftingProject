import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coach } from '../../../core/models/coach.model';
import { apiUrl } from '../../../enviroment';

@Injectable({
  providedIn: 'root',
})
export class CoachService {
  private _apiUrl = apiUrl + '/coaches'; // Ajusta la URL según tu backend

  constructor(private _http: HttpClient) {}

  getCoaches(): Observable<Coach[]> {
    return this._http.get<Coach[]>(this._apiUrl);
  }

  getCoach(coachId: number): Observable<Coach> {
    const url = `${this._apiUrl}/Coaches/${coachId}`;
    return this._http.get<Coach>(url);
  }
  getCoachesByNameAndSurname(
    name: string,
    surname: string
  ): Observable<Coach[]> {
    return this._http.get<Coach[]>(
      `${this._apiUrl}?name=${name}&surname=${surname}`
    );
  }

  createCoach(coach: Coach): Observable<Coach> {
    return this._http.post<Coach>(`${this._apiUrl}/Coaches`, coach);
  }
}
