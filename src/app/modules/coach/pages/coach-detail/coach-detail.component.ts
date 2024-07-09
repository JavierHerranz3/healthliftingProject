import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Coach, DocumentType } from '../../../../core/models/coach.model';
import { Appointment } from '../../../../core/models/appointment.model';
import { CoachService } from '../../service/coach.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentService } from '../../../appointment/service/appointment.service';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { TrainingSheet } from '../../../../core/models/trainingSheet.model';

@Component({
  selector: 'app-coach-detail',
  templateUrl: './coach-detail.component.html',
  styleUrls: ['./coach-detail.component.css'],
  providers: [DatePipe],
})
export class CoachDetailComponent implements OnInit {
  protected id: string = '';
  public coach?: Coach;
  protected dataSource = new MatTableDataSource<Coach>();
  protected appointmentsDataSource = new MatTableDataSource<Appointment>();
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'document'];
  protected appointmentDisplayedColumns: string[] = [
    'date',
    'athleteName',
    'athleteSurname',
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
  @ViewChild('trainingSheetsPaginator') trainingSheetsPaginator!: MatPaginator;

  constructor(
    private _coachService: CoachService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getCoachById(this.id);
      this.loadAllAppointments(this.id, 0, 5);
      this.appointmentsDataSource.paginator = this.paginator;
      this.trainingSheetsDataSource.paginator = this.trainingSheetsPaginator;
    });
  }

  getCoachById(id: string): void {
    this._coachService.getCoachById(id).subscribe({
      next: (value) => {
        this.coach = value;
        console.log('Coach fetched', value);
      },
      error: (err) => {
        console.error('Error fetching coach', err);
      },
    });
  }

  loadAllAppointments(coachId: string, page: number, size: number): void {
    this._coachService.getAppointmentsByCoachId(coachId, page, size).subscribe({
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

  onAppointmentsPageChange(event: any): void {
    this.loadAllAppointments(this.id, event.pageIndex, event.pageSize);
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
        this.deleteCoach();
      }
    });
  }

  deleteCoach(): void {
    this._coachService.deleteCoach(this.id).subscribe({
      next: () => {
        console.log('Coach deleted successfully');
        this._routerNav.navigate(['']);
      },
      error: (error) => {
        console.error('Error deleting coach', error);
      },
    });
  }

  saveChanges(): void {
    if (this.coach) {
      this._coachService.updateCoach(this.id, this.coach).subscribe({
        next: () => {
          console.log('Coach updated successfully');
          this.toggleEdit();
          this._snackBar.open(
            'Entrenador actualizado correctamente',
            'Cerrar',
            {
              duration: 3000,
            }
          );
        },
        error: (err) => {
          console.error('Error updating coach', err);
        },
      });
    }
  }

  modifyCoach(): void {
    this.toggleEdit();
  }

  goToAppointments(coach: Coach): void {
    if (coach && coach.id) {
      this._routerNav.navigate([`/appointments/list/${coach.id}`]);
    }
  }

  goToAppointmentDetails(appointment: Appointment): void {
    if (appointment && appointment.id) {
      this._routerNav.navigate([`/appointments/detail/${appointment.id}`]);
    }
  }
}
