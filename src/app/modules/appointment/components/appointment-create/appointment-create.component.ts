// src/app/modules/appointment/components/appointment-create/appointment-create.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Athlete } from '../../../../core/models/athlete.model';
import { Coach } from '../../../../core/models/coach.model';
import { CoachService } from '../../../coach/service/coach.service';
import { AthleteService } from '../../../athlete/service/athlete.service';
import { AppointmentService } from '../../service/appointment.service';
import {
  FriendlyTrainingType,
  TrainingTypeRecordMap,
} from '../../../../core/models/trainningType.model';
import moment from 'moment';
import { Appointment } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css'],
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm: FormGroup;
  creationMessage: string = '';
  coaches: Coach[] = [];
  athletes: Athlete[] = [];
  trainingTypes: string[] = Object.values(FriendlyTrainingType);

  constructor(
    private fb: FormBuilder,
    private _appointmentService: AppointmentService,
    private _coachService: CoachService,
    private _athleteService: AthleteService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      athleteId: ['', Validators.required],
      athleteName: [{ value: '', disabled: true }, Validators.required],
      athleteSurname: [{ value: '', disabled: true }, Validators.required],
      athleteDocument: [{ value: '', disabled: true }, Validators.required],
      coachId: ['', Validators.required],
      coachName: [{ value: '', disabled: true }, Validators.required],
      coachSurname: [{ value: '', disabled: true }, Validators.required],
      coachDocument: [{ value: '', disabled: true }, Validators.required],
      trainingType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCoaches();
    this.loadAthletes();
  }

  loadCoaches() {
    this._coachService.getCoaches(0, 20).subscribe({
      next: (response) => {
        this.coaches = response.content;
      },
      error: (error) => console.error('Error fetching coaches:', error),
    });
  }

  loadAthletes() {
    this._athleteService.getAthletes(0, 20).subscribe({
      next: (response) => {
        this.athletes = response.content;
      },
      error: (error) => console.error('Error fetching athletes:', error),
    });
  }

  onAthleteSelected(event: any) {
    const selectedAthlete = this.athletes.find((a) => a.id === event.value);
    if (selectedAthlete) {
      this.appointmentForm.patchValue({
        athleteId: selectedAthlete.id,
        athleteName: selectedAthlete.personalInformation.name,
        athleteSurname: selectedAthlete.personalInformation.surname,
        athleteDocument: selectedAthlete.personalInformation.document,
      });
    }
  }

  onCoachSelected(event: any) {
    console.log('Selected coach event:', event);
    const selectedCoach = this.coaches.find((c) => c.id === event.value);
    if (selectedCoach) {
      this.appointmentForm.patchValue({
        coachId: selectedCoach.id,
        coachName: selectedCoach.personalInformation.name,
        coachSurname: selectedCoach.personalInformation.surname,
        coachDocument: selectedCoach.personalInformation.document,
      });
    } else {
      console.log('No coach found for the selected value:', event.value);
    }
  }

  submitForm() {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.getRawValue(); // Use getRawValue() to include disabled fields

      // Combinar la fecha y la hora en un solo objeto ISO string con formato adecuado
      const combinedDateTime = moment(formValues.date)
        .set({
          hour: moment(formValues.time, 'HH:mm').hour(),
          minute: moment(formValues.time, 'HH:mm').minute(),
        })
        .toISOString(); // Esto generará el formato 2021-01-14T03:07:22.000Z automáticamente

      // Crear el objeto de la nueva cita
      const newAppointment = {
        id: formValues.id,
        date: combinedDateTime,
        coachId: formValues.coachId,
        coachName: formValues.coachName,
        coachSurname: formValues.coachSurname,
        coachDocument: formValues.coachDocument,
        athleteId: formValues.athleteId,
        athleteName: formValues.athleteName,
        athleteSurname: formValues.athleteSurname,
        athleteDocument: formValues.athleteDocument,
        trainingTypeRecord:
          TrainingTypeRecordMap[
            formValues.trainingType as FriendlyTrainingType
          ], // Convertir el tipo de entrenamiento
      };

      console.log('New Appointment:', newAppointment);

      this._appointmentService.createAppointment(newAppointment).subscribe({
        next: (createdAppointment: Appointment) => {
          this.showSnackBar('Cita creada exitosamente', 'Éxito');
          this.resetForm();
          this._router.navigate([
            '/appointments/detail',
            createdAppointment.id,
          ]); // Redirigir a la página de detalles de la cita
        },
        error: (error) => {
          console.error('Error al crear la cita:', error);
          if (error.status === 400 && error.error) {
            console.error('Detalles del error:', error.error);
            this.showSnackBar(
              `Error al crear la cita: ${error.error}`,
              'Error'
            );
          } else {
            this.showSnackBar(
              'Error al crear la cita. Por favor, inténtelo de nuevo más tarde.',
              'Error'
            );
          }
        },
      });
    } else {
      console.error('Error al crear la cita: Formulario inválido');
      console.log('Form Controls:', this.appointmentForm.controls);
      Object.keys(this.appointmentForm.controls).forEach((key) => {
        const controlErrors = this.appointmentForm.get(key)?.errors;
        if (controlErrors != null) {
          console.log('Key control: ' + key + ', errors: ', controlErrors);
        }
      });
      this.showSnackBar(
        'Formulario inválido. Revise los datos ingresados.',
        'Error'
      );
    }
  }

  private showSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  private resetForm() {
    this.appointmentForm.reset();
    Object.keys(this.appointmentForm.controls).forEach((key) => {
      this.appointmentForm.get(key)?.setErrors(null);
      this.appointmentForm.get(key)?.markAsPristine();
      this.appointmentForm.get(key)?.markAsUntouched();
    });
  }
}
