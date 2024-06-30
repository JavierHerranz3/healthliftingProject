import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AthleteListComponent } from './components/athlete-list/athlete-list.component';
import { AthleteDetailComponent } from './components/athlete-detail/athlete-detail.component';
import { AthleteCreateComponent } from './components/athlete-create/athlete-create.component';
import { AthletePageComponent } from './pages/athlete-page/athlete-page.component';

const routes: Routes = [
  { path: '', component: AthletePageComponent },
  { path: 'list', component: AthleteListComponent },
  { path: 'create', component: AthleteCreateComponent },
  { path: 'detail/:id', component: AthleteDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteRoutingModule {}
