import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'athletes', loadChildren: () => import('./modules/athlete/athlete.module').then((m) => m.AthleteModule),
    },
    {
        path: 'coachs', loadChildren: () => import('./modules/coach/coach.module').then((m) => m.CoachModule),
    },
    {
        path: 'appointments', loadChildren: () => import('./modules/appointment/appointment.module').then((m) => m.AppointmentsModule),
    },
];
