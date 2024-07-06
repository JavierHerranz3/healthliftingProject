import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingSheetDetailComponent } from './pages/training-sheet-detail/training-sheet-detail.component';
import { TrainingSheetCreateComponent } from './components/training-sheet-create/training-sheet-create.component';
import { TrainingSheetListComponent } from './pages/training-sheet-list/training-sheet-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: TrainingSheetListComponent },
  { path: 'create-training-sheet', component: TrainingSheetCreateComponent },
  { path: 'detail/:id', component: TrainingSheetDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingSheetRoutingModule {}
