import { Injectable } from '@angular/core';
import { apiUrl } from '../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from '../../../core/models/page.model';
import { TrainingSheet } from '../../../core/models/trainingSheet.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingSheetService {
  private _apiUrl = apiUrl + '/trainingsheets';

  constructor(private _http: HttpClient) {}

  getTrainingSheets(
    page: number,
    size: number
  ): Observable<Page<TrainingSheet>> {
    const params = { page: page.toString(), size: size.toString() };
    return this._http.get<Page<TrainingSheet>>(this._apiUrl, { params });
  }

  getTrainingSheetById(id: string): Observable<TrainingSheet> {
    return this._http.get<TrainingSheet>(`${this._apiUrl}/${id}`);
  }

  createTrainingSheet(trainingSheet: any): Observable<any> {
    return this._http.post<any>(this._apiUrl, trainingSheet);
  }

  updateTrainingSheet(
    id: string,
    trainingSheet: TrainingSheet
  ): Observable<TrainingSheet> {
    return this._http.patch<TrainingSheet>(
      `${this._apiUrl}/${id}`,
      trainingSheet
    );
  }

  deleteTrainingSheet(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}

export { Page };
