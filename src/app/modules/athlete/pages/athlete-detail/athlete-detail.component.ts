import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Athlete } from '../../../../core/models/athlete.model';
import { Appointment } from '../../../../core/models/appointment.model';
import { AthleteService } from '../../service/athlete.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TrainingSheet } from '../../../../core/models/trainingSheet.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.component.html',
  styleUrls: ['./athlete-detail.component.css'],
  providers: [DatePipe],
})
export class AthleteDetailComponent implements OnInit, AfterViewInit {
  protected id: string = '';
  public athlete?: Athlete;
  protected dataSource = new MatTableDataSource<Athlete>();
  protected appointmentsDataSource = new MatTableDataSource<Appointment>();
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'document'];
  protected appointmentDisplayedColumns: string[] = [
    'date',
    'coachName',
    'coachSurname',
    'trainingType',
  ];
  protected activeAppointmentsCount = 0;
  protected isEditing = false;
  protected trainingSheetsDataSource = new MatTableDataSource<TrainingSheet>();
  protected trainingSheetsDisplayedColumns: string[] = [
    'trainingType',
    'observations',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) trainingSheetsPaginator!: MatPaginator;

  constructor(
    private _athleteService: AthleteService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getAthleteById(this.id);
      this.loadAllAppointments(this.id, 0, 10);
      this.loadAllTrainingSheets(this.id, 0, 10);
    });
  }

  ngAfterViewInit(): void {
    // Asigna el paginador a la fuente de datos después de que la vista se haya inicializado
    this.appointmentsDataSource.paginator = this.paginator;
    this.trainingSheetsDataSource.paginator = this.trainingSheetsPaginator;
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

  loadAllAppointments(athleteId: string, page: number, size: number): void {
    this._athleteService
      .getAppointmentsByAthleteId(athleteId, page, size)
      .subscribe({
        next: (appointmentsPage) => {
          this.appointmentsDataSource.data = appointmentsPage.content.map(
            (appointment: any) => ({
              ...appointment,
              date: this._datePipe.transform(appointment.date, 'medium') || '',
            })
          );
          this.paginator.length = appointmentsPage.totalElements;
          console.log(
            'Appointments fetched and filtered',
            this.appointmentsDataSource.data
          );
        },
        error: (err) => {
          console.error('Error fetching appointments', err);
        },
      });
  }

  loadAllTrainingSheets(athleteId: string, page: number, size: number): void {
    this._athleteService
      .getTrainingSheetsByAthleteId(athleteId, page, size)
      .subscribe({
        next: (trainingSheetsPage) => {
          console.log('Training Sheets Page:', trainingSheetsPage);
          this.trainingSheetsDataSource.data = trainingSheetsPage.content.map(
            (trainingSheet: any) => ({
              ...trainingSheet,
              date:
                this._datePipe.transform(trainingSheet.date, 'medium') || '',
            })
          );
          this.trainingSheetsPaginator.length =
            trainingSheetsPage.totalElements;
          console.log(
            'Training sheets fetched and filtered',
            this.trainingSheetsDataSource.data
          );
        },
        error: (err) => {
          console.error('Error fetching training sheets', err);
        },
      });
  }

  onAppointmentsPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.loadAllAppointments(this.id, pageIndex, pageSize);
  }

  onTrainingSheetsPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.loadAllTrainingSheets(this.id, pageIndex, pageSize);
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

  goToAppointments(athlete: Athlete): void {
    if (athlete && athlete.id) {
      this._routerNav.navigate([`/appointments/list/${athlete.id}`]);
    }
  }
  goToTrainingSheetDetails(trainingSheet: TrainingSheet): void {
    if (trainingSheet && trainingSheet.id) {
      this._routerNav.navigate([`/training-sheets/detail/${trainingSheet.id}`]);
    }
  }
  goToAppointmentDetails(appointment: Appointment): void {
    if (appointment && appointment.id) {
      this._routerNav.navigate([`/appointments/detail/${appointment.id}`]);
    }
  }
}
