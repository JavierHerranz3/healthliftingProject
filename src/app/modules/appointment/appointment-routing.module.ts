import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentDetailComponent } from './components/appointment-detail/appointment-detail.component';
import { AppointmentCreateComponent } from './components/appointment-create/appointment-create.component';
import { AppointmentPageComponent } from './pages/appointment-page/appointment-page.component';

const routes: Routes = [
  { path: '', component: AppointmentPageComponent },
  { path: 'create-appointment', component: AppointmentCreateComponent },
  { path: 'detail/:id', component: AppointmentDetailComponent },
  { path: 'list', component: AppointmentListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentRoutingModule {}
