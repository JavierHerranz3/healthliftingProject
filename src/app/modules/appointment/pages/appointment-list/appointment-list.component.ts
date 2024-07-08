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
export class AppointmentListComponent implements OnInit, AfterViewInit {
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
  trainingTypes: string[] = Object.values(FriendlyTrainingType);
  trainingTypeControl = new FormControl('');
  searchTypeControl = new FormControl('');
  documentControl = new FormControl('');
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.trainingTypeControl.valueChanges.subscribe(() => this.applyFilter());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (appointments: any) => {
        console.log('Fetched appointments:', appointments);
        this.dataSource.data = appointments.content.map(
          (appointment: Appointment) => {
            console.log('Appointment:', appointment);
            return appointment;
          }
        );
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }

  applyFilter(): void {
    const trainingTypeFriendly = this.trainingTypeControl.value?.trim() || '';
    const trainingType =
      TrainingTypeRecordMap[trainingTypeFriendly as FriendlyTrainingType] || '';

    this.dataSource.filterPredicate = (data: Appointment, filter: string) => {
      const matchesTrainingType = data.trainingTypeRecord
        .toLowerCase()
        .includes(trainingType.toLowerCase());
      return matchesTrainingType;
    };
    this.dataSource.filter = trainingType;
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
                console.log(
                  'Fetched appointments by coach document:',
                  appointments
                );
                this.dataSource.data = appointments.content;
                this.errorMessage = null; // Clear error message
              } else {
                this.showErrorMessage();
              }
            },
            (error) => {
              console.error(
                'Error fetching appointments by coach document:',
                error
              );
              this.showErrorMessage();
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
                console.log(
                  'Fetched appointments by athlete document:',
                  appointments
                );
                this.dataSource.data = appointments.content;
                this.errorMessage = null; // Clear error message
              } else {
                this.showErrorMessage();
              }
            },
            (error) => {
              console.error(
                'Error fetching appointments by athlete document:',
                error
              );
              this.showErrorMessage();
            }
          );
      }
    }
  }

  showErrorMessage(): void {
    this.errorMessage = 'Documento no encontrado';
    this.documentControl.setValue('');
  }
}
