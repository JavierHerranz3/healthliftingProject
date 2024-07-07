import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentService } from '../../service/appointment.service';
import { AthleteService } from '../../../athlete/service/athlete.service';
import { CoachService } from '../../../coach/service/coach.service';
import { Page } from '../../../../core/models/page.model';
import {
  FriendlyTrainingType,
  TrainingTypeRecordMap,
} from '../../../../core/models/trainningType.model';
import moment from 'moment-timezone';
import { Athlete } from '../../../../core/models/athlete.model';
import { Coach } from '../../../../core/models/coach.model';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css'],
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any = {}; // Inicializar como objeto vacío para evitar undefined
  athlete: Athlete = {} as Athlete; // Inicialización con valor por defecto
  coach: Coach = {} as Coach; // Inicialización con valor por defecto
  coaches: Coach[] = [];
  athletes: Athlete[] = [];
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
      coachId: ['', Validators.required],
      trainingTypeRecord: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.getAppointmentById(this.id);
    });
    this.loadCoaches();
    this.loadAthletes();
  }

  loadCoaches() {
    this.coachService.getCoaches(0, 20).subscribe({
      next: (coachPage: Page<Coach>) => {
        if (Array.isArray(coachPage.content)) {
          this.coaches = coachPage.content;
        } else {
          console.error('Expected an array for coaches:', coachPage.content);
        }
        console.log('Coaches loaded:', this.coaches);
      },
      error: (err) => console.error('Error fetching coaches', err),
    });
  }

  loadAthletes() {
    this.athleteService.getAthletes(0, 20).subscribe({
      next: (athletePage: Page<Athlete>) => {
        if (Array.isArray(athletePage.content)) {
          this.athletes = athletePage.content;
        } else {
          console.error('Expected an array for athletes:', athletePage.content);
        }
        console.log('Athletes loaded:', this.athletes);
      },
      error: (err) => console.error('Error fetching athletes', err),
    });
  }

  getAppointmentById(id: string): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        this.appointment = appointment;
        this.getAthleteById(appointment.athleteId);
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

  onCoachSelected(event: any) {
    const selectedCoachId = event.value;
    const selectedCoach = this.coaches.find(
      (coach) => coach.id === selectedCoachId
    );

    if (selectedCoach) {
      this.appointmentForm.patchValue({
        coachId: selectedCoach.id,
        coachName: selectedCoach.personalInformation.name,
        coachSurname: selectedCoach.personalInformation.surname,
        coachDocument: selectedCoach.personalInformation.document,
      });
      console.log('Selected coach ID:', selectedCoach.id);
      console.log('Form value after selection:', this.appointmentForm.value);
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.value;
      const combinedDateTime = moment(formValues.date)
        .set({
          hour: moment(formValues.time, 'HH:mm').hour(),
          minute: moment(formValues.time, 'HH:mm').minute(),
        })
        .toISOString(); // Esto generará el formato 2021-01-14T03:07:22.000Z automáticamente

      const trainingTypeRecord =
        TrainingTypeRecordMap[
          formValues.trainingTypeRecord as FriendlyTrainingType
        ];

      const selectedCoach = this.coaches.find(
        (coach) => coach.id === formValues.coachId
      );

      const updatedAppointment = {
        ...this.appointment,
        date: combinedDateTime,
        coachId: formValues.coachId,
        coachName: selectedCoach
          ? selectedCoach.personalInformation.name
          : undefined,
        coachSurname: selectedCoach
          ? selectedCoach.personalInformation.surname
          : undefined,
        coachDocument: selectedCoach
          ? selectedCoach.personalInformation.document
          : undefined,
        trainingTypeRecord: trainingTypeRecord,
      };

      console.log('Form Values:', formValues);
      console.log('Updated Appointment:', updatedAppointment);

      this.appointmentService
        .updateAppointment(this.id, updatedAppointment)
        .subscribe({
          next: () => {
            console.log('Respuesta exitosa del backend');
            this.snackBar.open('Cita actualizada correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.toggleEdit();
            this.getAppointmentById(this.id);
          },
          error: (err) => console.error('Error actualizando cita', err),
        });
    } else {
      console.error('Formulario no válido');
    }
  }
  populateForm(): void {
    if (this.appointment && this.appointment.date) {
      const date = moment(this.appointment.date).format('YYYY-MM-DD');
      const time = moment(this.appointment.date).format('HH:mm');
      this.appointmentForm.patchValue({
        date: date,
        time: time,
        coachId: this.appointment.coachId,
        trainingTypeRecord: this.appointment.trainingTypeRecord,
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
      error: (err) => console.error('Error eliminando cita', err),
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
