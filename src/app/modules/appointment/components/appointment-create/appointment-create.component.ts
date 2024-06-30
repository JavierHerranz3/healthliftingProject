import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AppointmentService } from '../../service/appointment.service';
import { AthleteService } from '../../../athlete/service/athlete.service';
import { CoachService } from '../../../coach/service/coach.service';
import { Athlete } from '../../../../core/models/athlete.model';
import { Coach } from '../../../../core/models/coach.model';
import { Appointment } from '../../../../core/models/appointment.model';
import { trainningType } from '../../../../core/models/trainningSheet.model';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css'],
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm: FormGroup;
  athletes: Athlete[] = [];
  coaches: Coach[] = [];
  hours: string[] = [];
  trainingTypes: string[] = Object.values(trainningType);

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private athleteService: AthleteService,
    private coachService: CoachService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      athleteId: ['', Validators.required],
      coachId: ['', Validators.required],
      trainningType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.athleteService.getAthletes().subscribe((data: Athlete[]) => {
      this.athletes = data;
    });

    this.coachService.getCoaches().subscribe((data: Coach[]) => {
      this.coaches = data;
    });

    this.initializeHours();
  }

  initializeHours(): void {
    for (let i = 9; i <= 20; i++) {
      this.hours.push(`${i}:00`);
    }
  }

  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.appointmentForm.valid) {
      const newAppointment: Appointment = {
        ...this.appointmentForm.value,
        id: '', // El id puede ser asignado por el backend o por algún otro mecanismo
      };
      this.appointmentService.createAppointment(newAppointment).subscribe(
        (appointment: Appointment) => {
          alert('La cita ha sido creada correctamente.');
          this.router.navigate(['/appointments', appointment.id]);
        },
        (error: any) => {
          alert(
            'Hubo un error al crear la cita. Por favor, intenta nuevamente.'
          );
        }
      );
    }
  }
}
