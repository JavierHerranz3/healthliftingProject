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
    'details',
  ];
  dataSource = new MatTableDataSource<Appointment>();
  searchControl = new FormControl('');
  trainingTypes: string[] = Object.values(FriendlyTrainingType);
  trainingTypeControl = new FormControl('');
  coachIdControl = new FormControl('');

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

  onDetailsButtonClick(id: string): void {
    console.log('Appointment ID:', id);
    if (id) {
      this.router.navigate(['/appointments/detail', id]);
    } else {
      console.error('Invalid appointment ID:', id);
    }
  }
  searchAppointmentsByCoachId(): void {
    const coachId = this.coachIdControl.value;
    if (coachId) {
      this.appointmentService
        .getAppointmentsByCoachId(
          coachId,
          this.paginator.pageIndex,
          this.paginator.pageSize
        )
        .subscribe(
          (appointments: any) => {
            console.log('Fetched appointments by coach ID:', appointments);
            this.dataSource.data = appointments.content.map(
              (appointment: Appointment) => {
                console.log('Appointment:', appointment);
                return appointment;
              }
            );
          },
          (error) => {
            console.error('Error fetching appointments by coach ID:', error);
          }
        );
    }
  }
}
