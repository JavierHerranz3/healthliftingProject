import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/login.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let user: User | null= null;
 authService.user.subscribe((user: any) => (user = user))
 if(user){
  const newReq = req.clone({
    headers: req.headers.set('auth_token', (user as unknown as User).token),
  });
  return next(newReq);
 }
  return next(req);
};
