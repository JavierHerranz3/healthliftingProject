import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingSheetService } from '../../service/training-sheet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Appointment } from '../../../../core/models/appointment.model'; // Ajusta la ruta según tu estructura de proyecto

import { AppointmentService } from '../../../appointment/service/appointment.service';

import { TrainingSheet } from '../../../../core/models/trainingSheet.model';

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
  trainingTypeRecord = ''; // Variable para almacenar el tipo de entrenamiento

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
      observations: ['', Validators.required],
      coachId: ['', Validators.required],
      athleteId: ['', Validators.required],
      appointmentId: ['', Validators.required],
      coachName: [{ value: '', disabled: true }, Validators.required],
      athleteName: [{ value: '', disabled: true }, Validators.required],
      appointmentDate: [{ value: '', disabled: true }, Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      console.log('Query Params:', params);
      if (params['appointmentId']) {
        this.trainingSheetForm.patchValue({
          appointmentId: params['appointmentId'],
          athleteId: params['athleteId'],
          coachId: params['coachId'],
          trainingType: params['trainingType'],
        });

        this.loadAppointmentDetails(params['appointmentId']);

        // Redirigir a la ruta deseada sin parámetros de consulta
        this.router.navigate(['/training-sheets/create-training-sheet'], {
          replaceUrl: true,
        });
      }
    });
  }

  loadAppointmentDetails(appointmentId: string): void {
    this.appointmentService
      .getAppointmentById(appointmentId)
      .subscribe((appointment: Appointment) => {
        console.log('Appointment Details:', appointment);
        this.coachName = `${appointment.coachName} ${appointment.coachSurname}`;
        this.athleteName = `${appointment.athleteName} ${appointment.athleteSurname}`;
        this.appointmentDate = appointment.date;
        this.trainingTypeRecord = appointment.trainingTypeRecord; // Asignar el valor de trainingTypeRecord

        // Parchar coachId y otros detalles en el formulario
        this.trainingSheetForm.patchValue({
          coachName: this.coachName,
          athleteName: this.athleteName,
          appointmentDate: this.appointmentDate,
          trainingType: this.trainingTypeRecord, // Mostrar el tipo de entrenamiento en el formulario
          coachId: appointment.coachId, // Asignar coachId directamente desde los detalles de la cita
        });
      });
  }

  submitForm(): void {
    console.log('submitForm called'); // Log para verificar si la función es llamada
    if (this.trainingSheetForm.valid) {
      const formValues = this.trainingSheetForm.value;
      console.log('Form Values:', formValues); // Log para verificar los valores del formulario
      const newTrainingSheet: TrainingSheet = {
        id: '',
        trainingTypeRecord: this.trainingTypeRecord, // Añadir el tipo de entrenamiento
        observations: formValues.observations,
        coachId: formValues.coachId,
        athleteId: formValues.athleteId,
        appointmentId: formValues.appointmentId,
        coachName: formValues.coachName,
        coachSurname: formValues.coachSurname,
        coachDocument: formValues.coachDocument,
        athleteName: formValues.athleteName,
        athleteSurname: formValues.athleteSurname,
        athleteDocument: formValues.athleteDocument,
      };
      this.createTrainingSheet(newTrainingSheet);
    } else {
      console.error('Formulario no válido', this.trainingSheetForm); // Log para verificar si el formulario es inválido
    }
  }

  private createTrainingSheet(trainingSheet: TrainingSheet): void {
    this.isLoading = true;
    this.trainingSheetService.createTrainingSheet(trainingSheet).subscribe({
      next: (createdTrainingSheet: TrainingSheet) => {
        this.isLoading = false;
        console.log(
          'Training sheet created successfully:',
          createdTrainingSheet
        );
        if (createdTrainingSheet && createdTrainingSheet.id) {
          this.snackBar.open(
            'Ficha de entrenamiento creada correctamente',
            'Cerrar',
            {
              duration: 3000,
            }
          );
          this.router.navigate([
            '/training-sheets/detail',
            createdTrainingSheet.id,
          ]);
        } else {
          console.error(
            'El objeto creado no tiene un ID:',
            createdTrainingSheet
          );
        }
      },
      error: (error: any) => {
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
