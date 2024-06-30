import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AthleteRoutingModule } from './athlete-routing.module';
import { AthleteDetailComponent } from './components/athlete-detail/athlete-detail.component';
import { AthleteListComponent } from './components/athlete-list/athlete-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AthleteCreateComponent } from './components/athlete-create/athlete-create.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AthletePageComponent } from './pages/athlete-page/athlete-page.component';

@NgModule({
  declarations: [
    AthleteDetailComponent,
    AthleteListComponent,
    AthleteCreateComponent,
    AthletePageComponent,
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
