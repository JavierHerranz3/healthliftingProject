import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AthleteCreationContainerComponent } from './buttons/athlete-creation-container/athlete-creation-container.component';
import { AppointmentCreationContainerComponent } from './buttons/appointment-creation-container/appointment-creation-container.component';
import { CoachCreationContainerComponent } from './buttons/coach-creation-container/coach-creation-container.component';

@NgModule({
  declarations: [
    AthleteCreationContainerComponent,
    CoachCreationContainerComponent,
    AppointmentCreationContainerComponent,
  ],
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
  ],
  exports: [
    AppointmentCreationContainerComponent,
    AthleteCreationContainerComponent,
    CoachCreationContainerComponent,
  ],
})
export class SharedModule {}
