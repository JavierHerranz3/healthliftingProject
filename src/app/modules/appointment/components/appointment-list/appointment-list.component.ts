import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Appointment } from '../../../../core/models/appointment.model';
import { AppointmentService } from '../../service/appointment.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'time', 'athlete', 'coach', 'location'];
  dataSource: MatTableDataSource<Appointment> = new MatTableDataSource<Appointment>();
  appointments: Appointment[] = [];
  appointmentsByDay: { [key: string]: Appointment[] } = {};
  searchControl: FormControl;
  isSearchVisible = false;
  isTableVisible = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private appointmentService: AppointmentService, private fb: FormBuilder) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((data: Appointment[]) => {
      this.appointments = data;
      this.organizeAppointmentsByDay();
    });

    this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterAppointments(value))
    ).subscribe((filtered: Appointment[]) => {
      this.dataSource.data = filtered;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  organizeAppointmentsByDay(): void {
    this.appointmentsByDay = this.appointments.reduce((acc: { [key: string]: Appointment[] }, appointment: Appointment) => {
      const date = appointment.date.toString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(appointment);
      return acc;
    }, {});
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }

  showTable(): void {
    this.isTableVisible = true;
    this.organizeAppointmentsByDay();
  }

  filterAppointments(value: string): Appointment[] {
    const filterValue = value.toLowerCase();
    return this.appointments.filter(appointment =>
      appointment.athleteName.toLowerCase().includes(filterValue) ||
      appointment.coachName.toLowerCase().includes(filterValue)
    );
  }
}