import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AthleteRoutingModule } from './athlete-routing.module';

import { AthleteCreateComponent } from './components/athlete-create/athlete-create.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AthleteDetailComponent } from './pages/athlete-detail/athlete-detail.component';
import { AthleteListComponent } from './pages/athlete-list/athlete-list.component';

@NgModule({
  declarations: [
    AthleteDetailComponent,
    AthleteListComponent,
    AthleteCreateComponent,
  ],
  imports: [
    CommonModule,
    AthleteRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
  ],
})
export class AthleteModule {}