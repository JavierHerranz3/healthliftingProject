import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'athletes',
    loadChildren: () =>
      import('./modules/athlete/athlete.module').then((m) => m.AthleteModule),
  },
  {
    path: 'coaches',
    loadChildren: () =>
      import('./modules/coach/coach.module').then((m) => m.CoachModule),
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('./modules/appointment/appointment.module').then(
        (m) => m.AppointmentsModule
      ),
  },
  {
    path: 'training-sheets',
    loadChildren: () =>
      import('./modules/training-sheet/training-sheet.module').then(
        (m) => m.TrainingSheetModule
      ),
  },
];
