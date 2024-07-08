import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingSheetRoutingModule } from './training-sheet-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { TrainingSheetDetailComponent } from './pages/training-sheet-detail/training-sheet-detail.component';
import { TrainingSheetListComponent } from './pages/training-sheet-list/training-sheet-list.component';
import { TrainingSheetCreateComponent } from './components/training-sheet-create/training-sheet-create.component';
import { SharedModule } from '../../shared/components/shared.module';

@NgModule({
  declarations: [
    TrainingSheetDetailComponent,
    TrainingSheetListComponent,
    TrainingSheetCreateComponent,
  ],
  imports: [
    CommonModule,
    TrainingSheetRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
    MatDialogModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatListModule,
    SharedModule,
  ],
})
export class TrainingSheetModule {}
