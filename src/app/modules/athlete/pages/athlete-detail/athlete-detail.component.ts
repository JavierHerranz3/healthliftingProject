import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Athlete, DocumentType } from '../../../../core/models/athlete.model';
import { Appointment } from '../../../../core/models/appointment.model';
import { AthleteService } from '../../service/athlete.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.component.html',
  styleUrls: ['./athlete-detail.component.css'],
})
export class AthleteDetailComponent implements OnInit {
  protected id: string = '';
  protected athlete?: Athlete;
  protected dataSource = new MatTableDataSource<Athlete>();
  protected appointmentsDataSource = new MatTableDataSource<Appointment>(); // DataSource para las citas
  protected page?: { content: Athlete[]; totalElements: number };
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'document'];
  protected appointmentDisplayedColumns: string[] = [
    'id',
    'date',
    'coachName',
    'coachSurname',
    'trainingType',
  ];
  protected activeAppointmentsCount = 0;
  protected isEditing = false; // Nueva variable para controlar el estado de edición

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  documentTypes: any;

  constructor(
    private _athleteService: AthleteService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id']; // Obtén el ID del atleta de los parámetros de la URL
      this.getAthleteById(this.id);
      this.dataSource.paginator = this.paginator;
    });
  }

  getAthleteById(id: string): void {
    this._athleteService.getAthleteById(id).subscribe({
      next: (value) => {
        this.athlete = value;
        console.log('Athlete fetched', value);
      },
      error: (err) => {
        console.error('Error fetching athlete', err);
      },
    });
  }

  getAppointments(): void {
    if (this.athlete && this.athlete.idAppointments) {
      const appointmentRequests = this.athlete.idAppointments.map((id) =>
        this._athleteService.getAppointmentById(id)
      );

      forkJoin(appointmentRequests).subscribe({
        next: (appointments) => {
          this.appointmentsDataSource.data = appointments;
          this.activeAppointmentsCount = appointments.length;
          console.log('Appointments fetched', appointments);
        },
        error: (err) => {
          console.error('Error fetching appointments', err);
        },
      });
    }
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
        this.deleteAthlete();
      }
    });
  }

  deleteAthlete(): void {
    this._athleteService.deleteAthlete(this.id).subscribe({
      next: () => {
        console.log('Athlete deleted successfully');
        this._routerNav.navigate(['']);
      },
      error: (error) => {
        console.error('Error deleting athlete', error);
      },
    });
  }

  saveChanges(): void {
    if (this.athlete) {
      this._athleteService.updateAthlete(this.id, this.athlete).subscribe({
        next: () => {
          console.log('Athlete updated successfully');
          this.toggleEdit();
          this._snackBar.open('Atleta actualizado correctamente', 'Cerrar', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Error updating athlete', err);
        },
      });
    }
  }

  modifyAthlete(): void {
    this.toggleEdit();
  }
}
