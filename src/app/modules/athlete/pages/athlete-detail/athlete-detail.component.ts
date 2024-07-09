import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  input,
  Input,
} from '@angular/core';
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
  @Input() pageLengthAppointments = 0;
  @Input() pageSizeAppointments = 5;
  @Input() pageLengthTrainingSheets = 0;
  @Input() pageSizeTrainingSheets = 5;
  @ViewChild('paginatorAppointments') paginatorAppointments!: MatPaginator;
  @ViewChild('paginatorTrainingSheets') paginatorTrainingSheets!: MatPaginator;

  private allAppointments: Appointment[] = [];
  private allTrainingSheets: TrainingSheet[] = [];

  constructor(
    private _athleteService: AthleteService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getAthleteById(this.id);
      this.loadAllAppointments(this.id); // Load all appointments initially
      this.loadAllTrainingSheets(this.id); // Default page size for training sheets
    });
  }

  ngAfterViewInit(): void {
    this.appointmentsDataSource.paginator = this.paginatorAppointments;
    this.trainingSheetsDataSource.paginator = this.paginatorTrainingSheets;
  }

  getAthleteById(id: string): void {
    this._athleteService.getAthleteById(id).subscribe({
      next: (value) => {
        this.athlete = value;
      },
      error: (err) => {
        console.error('Error fetching athlete', err);
      },
    });
  }

  loadAllAppointments(athleteId: string): void {
    this._athleteService.getAppointmentsByAthleteId(athleteId).subscribe({
      next: (response) => {
        this.allAppointments = response.content;
        this.pageLengthAppointments = response.totalElements;
        this.updateAppointmentsDataSource(0, this.pageSizeAppointments); // Initialize with the first page of appointments
      },
      error: (err) => {
        console.error('Error fetching appointments', err);
      },
    });
  }

  updateAppointmentsDataSource(pageIndex: number, pageSize: number): void {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    if (startIndex < this.allAppointments.length) {
      this.appointmentsDataSource.data = this.allAppointments.slice(
        startIndex,
        Math.min(endIndex, this.allAppointments.length)
      );
    } else {
      this.appointmentsDataSource.data = [];
    }
  }

  onAppointmentsPageChange(event: any): void {
    this.updateAppointmentsDataSource(event.pageIndex, event.pageSize);
  }

  loadAllTrainingSheets(athleteId: string): void {
    this._athleteService.getTrainingSheetsByAthleteId(athleteId).subscribe({
      next: (response) => {
        this.allTrainingSheets = response.content;
        this.pageLengthTrainingSheets = response.totalElements;
        this.updateTrainingSheetsDataSource(0, this.pageSizeTrainingSheets); // Initialize with the first page of training sheets
      },
      error: (err) => {
        console.error('Error fetching training sheets', err);
      },
    });
  }
  updateTrainingSheetsDataSource(pageIndex: number, pageSize: number): void {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    if (startIndex < this.allTrainingSheets.length) {
      this.trainingSheetsDataSource.data = this.allTrainingSheets.slice(
        startIndex,
        Math.min(endIndex, this.allTrainingSheets.length)
      );
    } else {
      this.trainingSheetsDataSource.data = [];
    }
  }

  onTrainingSheetsPageChange(event: any): void {
    this.updateTrainingSheetsDataSource(event.pageIndex, event.pageSize);
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
