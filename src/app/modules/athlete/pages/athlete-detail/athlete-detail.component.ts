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
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.component.html',
  styleUrls: ['./athlete-detail.component.css'],
})
export class AthleteDetailComponent implements OnInit {
  protected id: string = '';
  protected athlete?: Athlete;
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
      this.getAppointmentsByAthleteId(this.id, { page: 0, size: 5 });
      this.dataSource.paginator = this.paginator;
      this.appointmentsDataSource.sort = this.sort;
      this.appointmentsDataSource.sortingDataAccessor = (
        item: Appointment,
        property: string
      ) => {
        switch (property) {
          case 'date':
            return new Date(item.date).getTime();
          case 'coachName':
            return item.coachName;
          case 'coachSurname':
            return item.coachSurname;
          case 'trainingType':
            return item.trainingTypeRecord;
          default:
            return '';
        }
      };
      this.sort.sortChange.subscribe(() => {
        this.customSort();
      });
      this.customSort();
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

  getAppointmentsByAthleteId(athleteId: string, pageable: any): void {
    this._athleteService
      .getAppointmentsByAthleteId(athleteId, pageable)
      .subscribe({
        next: (appointmentsPage) => {
          const appointments = appointmentsPage.content;
          this.appointmentsDataSource.data = appointments;
          this.activeAppointmentsCount = appointments.length;
          console.log('Appointments fetched and filtered', appointments);
          this.customSort();
        },
        error: (err) => {
          console.error('Error fetching appointments', err);
        },
      });
  }

  customSort(): void {
    this.appointmentsDataSource.data = this.appointmentsDataSource.data.sort(
      (a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        const today = new Date().getTime();
        const diffA = Math.abs(dateA - today);
        const diffB = Math.abs(dateB - today);
        return diffA - diffB;
      }
    );
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

  goToAppointmentDetails(appointment: Appointment): void {
    if (appointment && appointment.id) {
      this._routerNav.navigate([`/appointments/detail/${appointment.id}`]);
    }
  }
}
