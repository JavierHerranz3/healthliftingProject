import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './pages/appointment-list/appointment-list.component';
import { AppointmentDetailComponent } from './pages/appointment-detail/appointment-detail.component';
import { AppointmentCreateComponent } from './components/appointment-create/appointment-create.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'create-appointment', component: AppointmentCreateComponent },
  { path: 'detail/:id', component: AppointmentDetailComponent },
  { path: 'list', component: AppointmentListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentRoutingModule {}
