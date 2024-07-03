import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { AthleteService, Page } from '../../../athlete/service/athlete.service';
import { CoachService } from '../../../coach/service/coach.service';
import { Athlete } from '../../../../core/models/athlete.model';
import { Coach } from '../../../../core/models/coach.model';
import { Appointment } from '../../../../core/models/appointment.model';
import { trainningType } from '../../../../core/models/trainningSheet.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentService } from '../../service/appointment.service';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css'],
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm!: FormGroup;
  athletes: Athlete[] = [];
  coaches: Coach[] = [];
  appointments: Appointment[] = [];
  trainingTypes: string[] = Object.values(trainningType);
  hours: string[] = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];
  displayedColumns: string[] = [
    'date',
    'time',
    'athlete',
    'coach',
    'trainingType',
  ];
  dataSource = new MatTableDataSource<Appointment>();
  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private athleteService: AthleteService,
    private coachService: CoachService,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      athleteId: ['', Validators.required],
      coachId: ['', Validators.required],
      trainingType: ['', Validators.required],
    });

    this.loadAthletes();
    this.loadCoaches();
    this.loadAppointments();

    this.searchControl.valueChanges.subscribe((value) =>
      this.applyFilter(value)
    );
  }

  loadAthletes(): void {
    this.athleteService.getAthletes(0, 10).subscribe({
      next: (pageData: Page<Athlete>) => {
        this.athletes = pageData.content;
      },
      error: (error) => {
        console.error('Error fetching athletes:', error);
      },
    });
  }

  loadCoaches(): void {
    this.coachService.getCoaches().subscribe((coaches: Coach[]) => {
      this.coaches = coaches;
    });
  }

  loadAppointments(): void {
    this.appointmentService
      .getAppointments()
      .subscribe((appointments: Appointment[]) => {
        this.appointments = appointments;
        this.dataSource.data = appointments;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string | null): void {
    this.dataSource.filter = (filterValue || '').trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.value;
      const newAppointment: Appointment = {
        date: formValues.date,
        time: formValues.time,
        athleteId: formValues.athleteId,
        athleteName: this.getAthleteNameById(formValues.athleteId),
        coachId: formValues.coachId,
        coachName: this.getCoachNameById(formValues.coachId),
        trainingType: formValues.trainingType,
        id: '',
        athleteSurname: '',
        coachSurname: '',
      };

      this.appointmentService.createAppointment(newAppointment).subscribe({
        next: (appointment: Appointment) => {
          this.appointments.push(appointment);
          this.dataSource.data = this.appointments;
          this.snackBar.open('Cita creada exitosamente', 'Cerrar', {
            duration: 4000,
          });
        },
        error: (error: any) => {
          console.error('Error al crear la cita:', error);
        },
      });
    }
  }

  getAthleteNameById(id: string): string {
    const athlete = this.athletes.find((a) => a.id === id);
    return athlete
      ? `${athlete.personalInformation.name} ${athlete.personalInformation.surname}`
      : '';
  }

  getCoachNameById(id: string): string {
    const coach = this.coaches.find((c) => c.id === id);
    return coach
      ? `${coach.personalInformation.name} ${coach.personalInformation.surname}`
      : '';
  }
}
