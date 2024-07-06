import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingSheetService } from '../../service/training-sheet.service';
import { TrainingSheet } from '../../../../core/models/trainingSheet.model';

@Component({
  selector: 'app-training-sheet-create',
  templateUrl: './training-sheet-create.component.html',
  styleUrls: ['./training-sheet-create.component.css'],
})
export class TrainingSheetCreateComponent implements OnInit {
  trainingSheetForm!: FormGroup;
  isLoading = false; // Variable para el estado de carga

  constructor(
    private _fb: FormBuilder,
    private _trainingSheetService: TrainingSheetService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.trainingSheetForm = this._fb.group({
      trainingType: ['', Validators.required],
      observations: [''],
      coachId: ['', Validators.required],
      athleteId: ['', Validators.required],
      appointmentId: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.trainingSheetForm.valid) {
      const formValues = this.trainingSheetForm.value;
      const newTrainingSheet = {
        trainingType: formValues.trainingType,
        observations: formValues.observations,
        coachId: formValues.coachId,
        athleteId: formValues.athleteId,
        appointmentId: formValues.appointmentId,
      };
      this.createTrainingSheet(newTrainingSheet);
    }
  }

  private createTrainingSheet(newTrainingSheet: any): void {
    this.isLoading = true; // Mostrar el spinner
    this._trainingSheetService.createTrainingSheet(newTrainingSheet).subscribe({
      next: (createdTrainingSheet: TrainingSheet) => {
        this.isLoading = false; // Ocultar el spinner
        console.log(createdTrainingSheet);
        if (createdTrainingSheet && createdTrainingSheet.id) {
          this._snackBar.open(
            'Ficha de entrenamiento creada correctamente',
            'Cerrar',
            {
              duration: 3000,
            }
          );
          this._router.navigate([
            '/training-sheets/detail',
            createdTrainingSheet.id,
          ]); // Redirigir a la página de detalles de la ficha de entrenamiento
        } else {
          console.error(
            'El objeto creado no tiene un ID:',
            createdTrainingSheet
          );
        }
      },
      error: (error) => {
        this.isLoading = false; // Ocultar el spinner
        console.error('Error al crear la ficha de entrenamiento:', error);
      },
    });
  }
}
