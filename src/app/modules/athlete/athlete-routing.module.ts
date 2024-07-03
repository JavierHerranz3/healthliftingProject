import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AthleteListComponent } from './pages/athlete-list/athlete-list.component';
import { AthleteDetailComponent } from './pages/athlete-detail/athlete-detail.component';
import { AthleteCreateComponent } from './components/athlete-create/athlete-create.component';
const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: AthleteListComponent },
  { path: 'create-athlete', component: AthleteCreateComponent },
  { path: 'detail/:id', component: AthleteDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteRoutingModule {}
