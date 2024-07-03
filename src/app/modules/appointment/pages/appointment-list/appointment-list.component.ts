import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentService } from '../../service/appointment.service';
import { Appointment } from '../../../../core/models/appointment.model';
import { trainningType } from '../../../../core/models/trainningSheet.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'date',
    'time',
    'athlete',
    'coach',
    'trainingType',
  ];
  dataSource = new MatTableDataSource<Appointment>();
  searchControl = new FormControl('');
  trainingTypes: string[] = Object.values(trainningType);
  trainingTypeControl = new FormControl('');
  nameControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.trainingTypeControl.valueChanges.subscribe(() => this.applyFilter());
    this.nameControl.valueChanges.subscribe(() => this.applyFilter());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments(): void {
    this.appointmentService
      .getAppointments()
      .subscribe((appointments: Appointment[]) => {
        this.dataSource.data = appointments;
      });
  }

  applyFilter(): void {
    const trainingType =
      this.trainingTypeControl.value?.trim().toLowerCase() || '';
    const name = this.nameControl.value?.trim().toLowerCase() || '';

    this.dataSource.filterPredicate = (data: Appointment, filter: string) => {
      const matchesTrainingType = data.trainingType
        .toLowerCase()
        .includes(trainingType);
      const matchesName =
        data.athleteName.toLowerCase().includes(name) ||
        data.coachName.toLowerCase().includes(name);
      return matchesTrainingType && matchesName;
    };
    this.dataSource.filter = `${trainingType} ${name}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
