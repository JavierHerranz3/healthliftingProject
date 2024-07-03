import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AppointmentListComponent } from './pages/appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from './components/appointment-create/appointment-create.component';
import { AppointmentDetailComponent } from './pages/appointment-detail/appointment-detail.component';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    AppointmentListComponent,
    AppointmentCreateComponent,
    AppointmentDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppointmentRoutingModule,
  ],
})
export class AppointmentsModule {}
