import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentService } from '../../service/appointment.service';
import { Appointment } from '../../../../core/models/appointment.model';
import {
  FriendlyTrainingType,
  TrainingTypeRecordMap,
} from '../../../../core/models/trainningType.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  displayedColumns: string[] = [
    'date',
    'athlete',
    'athleteSurname',
    'coach',
    'coachSurname',
    'trainingType',
  ];
  dataSource = new MatTableDataSource<Appointment>();
  searchControl = new FormControl('');
  trainingTypes: string[] = ['Todos', ...Object.values(FriendlyTrainingType)];
  trainingTypeControl = new FormControl('');
  searchTypeControl = new FormControl('');
  documentControl = new FormControl('');
  appointments: Appointment[] = [];
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAppointments(0, 5);
    this.dataSource.paginator = this.paginator;
    this.trainingTypeControl.valueChanges.subscribe(() => this.applyFilter());
    this.dataSource.sort = this.sort;
  }

  getAppointments(page: number, size: number): void {
    this.appointmentService.getAppointments(page, size).subscribe({
      next: (value) => {
        if (value && value.content) {
          this.dataSource.data = value.content;
          if (this.paginator) {
            this.paginator.length = value.totalElements;
          }
        } else {
          console.error('Invalid response structure', value);
        }
      },
      error: (err) => {
        console.error('Error fetching appointments', err);
      },
    });
  }

  applyFilter(): void {
    const trainingTypeFriendly = this.trainingTypeControl.value?.trim() || '';
    if (trainingTypeFriendly === 'Todos') {
      this.dataSource.filter = '';
    } else {
      const trainingType =
        TrainingTypeRecordMap[trainingTypeFriendly as FriendlyTrainingType] ||
        '';

      this.dataSource.filterPredicate = (data: Appointment, filter: string) => {
        const matchesTrainingType = data.trainingTypeRecord
          .toLowerCase()
          .includes(trainingType.toLowerCase());
        return matchesTrainingType;
      };
      this.dataSource.filter = trainingType;
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToDetail(appointment: Appointment): void {
    if (appointment && appointment.id) {
      this.router.navigate([`/appointments/detail/${appointment.id}`]);
    }
  }

  searchAppointmentsByDocument(): void {
    const document = this.documentControl.value;
    const searchType = this.searchTypeControl.value;

    if (document && searchType) {
      if (searchType === 'coach') {
        this.appointmentService
          .getAppointmentsByCoachDocument(
            document,
            this.paginator.pageIndex,
            this.paginator.pageSize
          )
          .subscribe(
            (appointments: any) => {
              if (appointments.content.length > 0) {
                this.dataSource.data = appointments.content;
                this.errorMessage = null; // Clear error message
              } else {
                this.showErrorMessage();
                this.getAppointments(0, 5);
              }
            },
            (error) => {
              console.error(
                'Error fetching appointments by coach document:',
                error
              );
              this.showErrorMessage();
              this.getAppointments(0, 5);
            }
          );
      } else if (searchType === 'athlete') {
        this.appointmentService
          .getAppointmentsByAthleteDocument(
            document,
            this.paginator.pageIndex,
            this.paginator.pageSize
          )
          .subscribe(
            (appointments: any) => {
              if (appointments.content.length > 0) {
                this.dataSource.data = appointments.content;
                this.errorMessage = null; // Clear error message
              } else {
                this.showErrorMessage();
                this.getAppointments(0, 5);
              }
            },
            (error) => {
              console.error(
                'Error fetching appointments by athlete document:',
                error
              );
              this.showErrorMessage();
              this.getAppointments(0, 5);
            }
          );
      }
    }
  }
  public onPageChange(event: any): void {
    this.getAppointments(event.pageIndex, event.pageSize);
  }

  showErrorMessage(): void {
    this.errorMessage = 'Documento no encontrado';
    this.documentControl.setValue('');
  }
}
