import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coach } from '../../../core/models/coach.model';


@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private apiUrl = 'api/coaches';  // Ajusta la URL según tu backend

  constructor(private http: HttpClient) { }

  getCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(this.apiUrl);
  }
}
