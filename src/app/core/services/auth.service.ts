import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../enviroment';
import { LoginResponse, User } from '../models/login.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private _apiUrl = apiUrl;
private _user: BehaviorSubject<User|null>;
  user: any;
  constructor(private _http: HttpClient, private _router: Router) { 
    this._user = new BehaviorSubject<User|null>(null);
  }

  get User(): Observable<User | null>{
    return this._user.asObservable();
  }

  setUser(user: User){
    this._user.next(user);

  }

  async login(username: string, password: string): Promise<User>{
    return new Promise<User>((resolve, reject) => {
      this._http.post<LoginResponse>(this._apiUrl + '/users/login', {
        username: username,
        password: password,
    })
    .subscribe({
      next:(value) => {
        this._user.next(value.data.data.user);
        localStorage.setItem('user',JSON.stringify(value.data.data.user));
        this._router.navigateByUrl('/demand');
        resolve(value.data.data.user);
      },
      error: (error) => {
        reject(error);
      },
    }); 
  });
  }
}
