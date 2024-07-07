import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentService } from '../../service/appointment.service';
import { AthleteService } from '../../../athlete/service/athlete.service';
import { CoachService } from '../../../coach/service/coach.service';
import {
  FriendlyTrainingType,
  TrainingTypeRecordMap,
} from '../../../../core/models/trainningType.model';
import moment from 'moment-timezone';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css'],
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any = {}; // Inicializar como objeto vacío para evitar undefined
  athlete: any;
  coach: any;
  coaches: any[] = [];
  trainingTypes: string[] = Object.values(FriendlyTrainingType);
  id: string = '';
  isEditing = false;
  appointmentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private athleteService: AthleteService,
    private coachService: CoachService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      trainingType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.getAppointmentById(this.id);
    });
  }

  getAppointmentById(id: string): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        this.appointment = appointment;
        this.getAthleteById(appointment.athleteId);
        this.getCoachById(appointment.coachId);
        this.populateForm(); // Populate form with existing appointment data
      },
      error: (err) => console.error('Error fetching appointment', err),
    });
  }

  getAthleteById(id: string): void {
    this.athleteService.getAthleteById(id).subscribe({
      next: (athlete) => (this.athlete = athlete),
      error: (err) => console.error('Error fetching athlete', err),
    });
  }

  getCoachById(id: string): void {
    this.coachService.getCoachById(id).subscribe({
      next: (coach) => (this.coach = coach),
      error: (err) => console.error('Error fetching coach', err),
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.value;
      const combinedDateTime = moment(
        formValues.date + ' ' + formValues.time,
        'YYYY-MM-DD HH:mm'
      ).toISOString(true); // Adjusted for the desired format with timezone

      const updatedAppointment = {
        ...this.appointment,
        date: combinedDateTime,
        trainingTypeRecord:
          TrainingTypeRecordMap[
            formValues.trainingType as FriendlyTrainingType
          ],
      };

      this.appointmentService
        .updateAppointment(this.id, updatedAppointment)
        .subscribe({
          next: () => {
            this.snackBar.open('Cita actualizada correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.toggleEdit();
            this.getAppointmentById(this.id); // Refrescar los datos de la cita
          },
          error: (err) => console.error('Error updating appointment', err),
        });
    }
  }

  populateForm(): void {
    if (this.appointment && this.appointment.date) {
      const date = moment(this.appointment.date).format('YYYY-MM-DD');
      const time = moment(this.appointment.date).format('HH:mm');
      this.appointmentForm.patchValue({
        date: date,
        time: time,
        trainingType: Object.keys(FriendlyTrainingType).find(
          (key) =>
            TrainingTypeRecordMap[
              FriendlyTrainingType[key as keyof typeof FriendlyTrainingType]
            ] === this.appointment.trainingTypeRecord
        ),
      });
    }
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: '¿Está seguro de que desea eliminar esta cita?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteAppointment();
      }
    });
  }

  deleteAppointment(): void {
    this.appointmentService.deleteAppointment(this.id).subscribe({
      next: () => {
        this.snackBar.open('Cita eliminada correctamente', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/appointments/list']);
      },
      error: (err) => console.error('Error deleting appointment', err),
    });
  }
  navigateToCreateTrainingSheet(): void {
    this.router.navigate(['/training-sheets/create-training-sheet'], {
      queryParams: {
        appointmentId: this.appointment.id,
        athleteId: this.appointment.athleteId,
      },
    });
  }
}
