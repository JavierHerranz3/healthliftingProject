import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachDetailComponent } from './pages/coach-detail/coach-detail.component';
import { CoachListComponent } from './pages/coach-list/coach-list.component';
import { CoachCreateComponent } from './coach-create/coach-create.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: CoachListComponent },
  { path: 'create-coach', component: CoachCreateComponent },
  { path: 'detail/:id', component: CoachDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachRoutingModule {}
