import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoachRoutingModule } from './coach-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CoachDetailComponent } from './pages/coach-detail/coach-detail.component';
import { CoachListComponent } from './pages/coach-list/coach-list.component';

import { MatSortModule } from '@angular/material/sort';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CoachCreateComponent } from './components/coach-create/coach-create.component';
import { SharedModule } from '../../shared/components/shared.module';

@NgModule({
  declarations: [
    CoachDetailComponent,
    CoachListComponent,
    CoachCreateComponent,
  ],
  imports: [
    CommonModule,
    CoachRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    MatSortModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
  ],
})
export class CoachModule {}
