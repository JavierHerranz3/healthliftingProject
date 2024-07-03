import { Injectable } from '@angular/core';
import { apiUrl } from '../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getAthlete(AthleteId: number): Observable<Athlete> {
    const url = `${this._apiUrl}/athletes/${AthleteId}`;
    return this._http.get<Athlete>(url);
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
