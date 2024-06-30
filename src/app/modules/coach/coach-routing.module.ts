import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachDetailComponent } from './pages/coach-detail/coach-detail.component';
import { CoachListComponent } from './pages/coach-list/coach-list.component';

const routes: Routes = [
  { path: '', component: CoachListComponent},
  { path: ':id', component: CoachDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachRoutingModule { }
