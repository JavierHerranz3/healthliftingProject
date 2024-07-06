import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentService } from '../../service/appointment.service';
import { AthleteService } from '../../../athlete/service/athlete.service';
import { CoachService } from '../../../coach/service/coach.service';
import { FriendlyTrainingType } from '../../../../core/models/trainningSheet.model';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css'],
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any;
  athlete: any;
  coach: any;
  coaches: any[] = [];
  trainingTypes: string[] = Object.values(FriendlyTrainingType);
  id: string = '';
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private athleteService: AthleteService,
    private coachService: CoachService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.getAppointmentById(this.id);
      this.loadCoaches();
    });
  }

  getAppointmentById(id: string): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        this.appointment = appointment;
        this.getAthleteById(appointment.athleteId);
        this.getCoachById(appointment.coachId);
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

  loadCoaches(): void {
    this.coachService.getCoaches(0, 100).subscribe({
      next: (page) => (this.coaches = page.content),
      error: (err) => console.error('Error fetching coaches', err),
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    this.appointmentService
      .updateAppointment(this.id, this.appointment)
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
}
