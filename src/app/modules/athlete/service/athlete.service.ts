import { Injectable } from '@angular/core';
import { apiUrl } from '../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Athlete } from '../../../core/models/athlete.model';

@Injectable({
  providedIn: 'root',
})
export class AthleteService {
  private _apiUrl = apiUrl + '/athletes';

  constructor(private _http: HttpClient) {}

  getAthletes(): Observable<Athlete[]> {
    return this._http.get<Athlete[]>(this._apiUrl);
  }

  getAthlete(id: number): Observable<Athlete> {
    return this._http.get<Athlete>('${this._apiUrl}/${id}');
  }
  getAthletesByNameAndSurname(
    name: string,
    surname: string
  ): Observable<Athlete[]> {
    return this._http.get<Athlete[]>(
      `${this._apiUrl}?name=${name}&surname=${surname}`
    );
  }

  createAthlete(athlete: Athlete): Observable<Athlete> {
    return this._http.post<Athlete>(`${this._apiUrl}/athletes`, athlete);
  }
}
