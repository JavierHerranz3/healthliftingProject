import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Athlete } from '../../../../core/models/athlete.model';
import { Coach } from '../../../../core/models/coach.model';
import { CoachService } from '../../../coach/service/coach.service';
import { AthleteService } from '../../../athlete/service/athlete.service';
import { AppointmentService } from '../../service/appointment.service';
import { trainningType } from '../../../../core/models/trainningSheet.model';
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
  trainingTypes: string[] = Object.values(trainningType);
  hours: string[] = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

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
      coachId: ['', Validators.required],
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
      });
    }
  }

  onCoachSelected(event: any) {
    console.log('Selected coach event:', event); // Verifica que el evento se dispare
    const selectedCoach = this.coaches.find((c) => c.id === event.value);
    if (selectedCoach) {
      this.appointmentForm.patchValue({
        coachId: selectedCoach.id,
      });
      console.log('Selected coach:', selectedCoach); // Verifica que el entrenador se selecciona correctamente
    }
  }

  submitForm() {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.value;
      console.log('Form Values:', formValues); // Verifica los valores del formulario antes de crear la cita

      const combinedDateTime = new Date(formValues.date);
      combinedDateTime.setHours(
        Number(formValues.time.split(':')[0]),
        Number(formValues.time.split(':')[1])
      );

      const newAppointment: Appointment = {
        id: '',
        date: combinedDateTime,
        time: formValues.time,
        athleteId: formValues.athleteId,
        athleteName:
          this.athletes.find((a) => a.id === formValues.athleteId)
            ?.personalInformation.name || '',
        athleteSurname:
          this.athletes.find((a) => a.id === formValues.athleteId)
            ?.personalInformation.surname || '',
        coachId: formValues.coachId,
        coachName:
          this.coaches.find((c) => c.id === formValues.coachId)
            ?.personalInformation.name || '',
        coachSurname:
          this.coaches.find((c) => c.id === formValues.coachId)
            ?.personalInformation.surname || '',
        trainingType: formValues.trainingType,
      };

      console.log('New Appointment:', newAppointment); // Verifica los valores de la nueva cita

      this._appointmentService.createAppointment(newAppointment).subscribe({
        next: () => {
          this.showSnackBar('Cita creada exitosamente', 'Exito');
          this.resetForm();
          setTimeout(() => this._router.navigate(['/appointments/list']), 2000);
        },
        error: (error) => {
          console.error('Error al crear la cita:', error);
          this.showSnackBar('Error al crear la cita', 'Error');
        },
      });
    } else {
      console.error('Error al crear la cita: Formulario inválido');
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
