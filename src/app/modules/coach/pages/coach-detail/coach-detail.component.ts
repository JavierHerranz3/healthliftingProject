import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
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

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-coach-detail',
  templateUrl: './coach-detail.component.html',
  styleUrls: ['./coach-detail.component.css'],
  providers: [DatePipe],
})
export class CoachDetailComponent implements OnInit, AfterViewInit {
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
  @Input() pageLengthAppointments = 0;
  @Input() pageSizeAppointments = 5;
  @ViewChild('paginatorAppointments') paginatorAppointments!: MatPaginator;

  private allAppointments: Appointment[] = [];

  constructor(
    private _coachService: CoachService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getCoachById(this.id);
      this.loadAllAppointments(this.id); // Load all appointments initially
    });
  }

  ngAfterViewInit(): void {
    this.appointmentsDataSource.paginator = this.paginatorAppointments;
  }

  getCoachById(id: string): void {
    this._coachService.getCoachById(id).subscribe({
      next: (value) => {
        this.coach = value;
      },
      error: (err) => {
        console.error('Error fetching coach', err);
      },
    });
  }

  loadAllAppointments(coachId: string): void {
    this._coachService.getAppointmentsByCoachId(coachId).subscribe({
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
