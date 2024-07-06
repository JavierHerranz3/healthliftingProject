import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingSheetService } from '../../service/training-sheet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Appointment } from '../../../../core/models/appointment.model'; // Ajusta la ruta según tu estructura de proyecto

import { AppointmentService } from '../../../appointment/service/appointment.service';
import {
  FriendlyTrainingType,
  TrainingTypeRecordMap,
} from '../../../../core/models/trainningType.model';

@Component({
  selector: 'app-training-sheet-create',
  templateUrl: './training-sheet-create.component.html',
  styleUrls: ['./training-sheet-create.component.css'],
})
export class TrainingSheetCreateComponent implements OnInit {
  trainingSheetForm!: FormGroup;
  isLoading = false;
  coachName = '';
  athleteName = '';
  appointmentDate = '';
  trainingType = '';

  // Mapa de tipos de entrenamiento
  trainingTypeMap: { [key: string]: string } = {
    HIIT: 'High-Intensity Interval Training',
    YOGA: 'Yoga',
    PILATES: 'Pilates',
    // Agrega aquí los otros tipos de entrenamiento con sus traducciones correspondientes
  };

  constructor(
    private fb: FormBuilder,
    private trainingSheetService: TrainingSheetService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.trainingSheetForm = this.fb.group({
      trainingType: [{ value: '', disabled: true }, Validators.required],
      observations: [''],
      coachId: ['', Validators.required],
      athleteId: ['', Validators.required],
      appointmentId: ['', Validators.required],
      coachName: [{ value: '', disabled: true }, Validators.required],
      athleteName: [{ value: '', disabled: true }, Validators.required],
      appointmentDate: [{ value: '', disabled: true }, Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      if (params['appointmentId']) {
        this.trainingSheetForm.patchValue({
          appointmentId: params['appointmentId'],
          athleteId: params['athleteId'],
          coachId: params['coachId'],
          trainingType: params['trainingType'],
        });

        this.loadAppointmentDetails(params['appointmentId']);
      }
    });
  }

  loadAppointmentDetails(appointmentId: string): void {
    this.appointmentService
      .getAppointmentById(appointmentId)
      .subscribe((appointment: Appointment) => {
        this.coachName = `${appointment.coachName} ${appointment.coachSurname}`;
        this.athleteName = `${appointment.athleteName} ${appointment.athleteSurname}`;
        this.appointmentDate = appointment.date;
        this.trainingType =
          this.trainingTypeMap[
            appointment.trainingTypeRecord as FriendlyTrainingType
          ] || appointment.trainingTypeRecord;

        this.trainingSheetForm.patchValue({
          coachName: this.coachName,
          athleteName: this.athleteName,
          appointmentDate: this.appointmentDate,
          trainingType: this.trainingType,
        });
      });
  }

  submitForm(): void {
    if (this.trainingSheetForm.valid) {
      const formValues = this.trainingSheetForm.getRawValue();
      console.log('Form Values:', formValues); // Log the form values to the console
      this.createTrainingSheet(formValues);
    }
  }

  private createTrainingSheet(trainingSheet: any): void {
    this.isLoading = true;
    this.trainingSheetService.createTrainingSheet(trainingSheet).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open(
          'Ficha de entrenamiento creada correctamente',
          'Cerrar',
          {
            duration: 3000,
          }
        );
        this.router.navigate(['/training-sheets']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al crear la ficha de entrenamiento:', error);
        this.snackBar.open(
          'Error al crear la ficha de entrenamiento',
          'Cerrar',
          {
            duration: 3000,
          }
        );
      },
    });
  }
}
