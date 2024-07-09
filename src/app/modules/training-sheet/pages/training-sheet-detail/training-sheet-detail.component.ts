import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TrainingSheetService } from '../../service/training-sheet.service';
import { TrainingSheet } from '../../../../core/models/trainingSheet.model';
import { CoachService } from '../../../coach/service/coach.service';
import { AthleteService } from '../../../athlete/service/athlete.service';
import { AppointmentService } from '../../../appointment/service/appointment.service';

@Component({
  selector: 'app-training-sheet-detail',
  templateUrl: './training-sheet-detail.component.html',
  styleUrls: ['./training-sheet-detail.component.css'],
})
export class TrainingSheetDetailComponent implements OnInit {
  protected id: string = '';
  protected trainingSheet?: TrainingSheet;
  protected coachName = '';
  protected athleteName = '';
  protected appointmentDate = '';
  protected isEditing = false;

  constructor(
    private trainingSheetService: TrainingSheetService,
    private coachService: CoachService,
    private athleteService: AthleteService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.getTrainingSheetById(this.id);
    });
  }

  getTrainingSheetById(id: string): void {
    this.trainingSheetService.getTrainingSheetById(id).subscribe({
      next: (value) => {
        this.trainingSheet = value;
        this.getCoachName(value.coachId);
        this.getAthleteName(value.athleteId);
        this.getAppointmentDate(value.appointmentId);
      },
      error: (err) => {
        console.error('Error fetching training sheet', err);
      },
    });
  }

  getCoachName(coachId: string): void {
    this.coachService.getCoachById(coachId).subscribe({
      next: (coach) => {
        this.coachName = `${coach.personalInformation.name} ${coach.personalInformation.surname}`;
      },
      error: (err) => {
        console.error('Error fetching coach', err);
      },
    });
  }

  getAthleteName(athleteId: string): void {
    this.athleteService.getAthleteById(athleteId).subscribe({
      next: (athlete) => {
        this.athleteName = `${athlete.personalInformation.name} ${athlete.personalInformation.surname}`;
      },
      error: (err) => {
        console.error('Error fetching athlete', err);
      },
    });
  }

  getAppointmentDate(appointmentId: string): void {
    this.appointmentService.getAppointmentById(appointmentId).subscribe({
      next: (appointment) => {
        this.appointmentDate = appointment.date;
      },
      error: (err) => {
        console.error('Error fetching appointment', err);
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTrainingSheet();
      }
    });
  }

  deleteTrainingSheet(): void {
    this.trainingSheetService.deleteTrainingSheet(this.id).subscribe({
      next: () => {
        console.log('Training sheet deleted successfully');
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Error deleting training sheet', error);
      },
    });
  }

  saveChanges(): void {
    if (this.trainingSheet) {
      this.trainingSheetService
        .updateTrainingSheet(this.id, {
          ...this.trainingSheet,
          observations: this.trainingSheet.observations,
        })
        .subscribe({
          next: () => {
            console.log('Training sheet updated successfully');
            this.toggleEdit();
            this.snackBar.open(
              'Ficha de entrenamiento actualizada correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          },
          error: (err) => {
            console.error('Error updating training sheet', err);
          },
        });
    }
  }

  modifyTrainingSheet(): void {
    this.toggleEdit();
  }
}
