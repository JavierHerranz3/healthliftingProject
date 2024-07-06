import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CoachService } from '../../service/coach.service';
import { Coach, DocumentType } from '../../../../core/models/coach.model';

@Component({
  selector: 'app-coach-create',
  templateUrl: './coach-create.component.html',
  styleUrls: ['./coach-create.component.css'],
})
export class CoachCreateComponent implements OnInit {
  coachForm!: FormGroup;
  documentTypes: string[] = Object.values(DocumentType);
  inputMessage: string = '';
  isLoading = false; // Variable para el estado de carga

  constructor(
    private _fb: FormBuilder,
    private _coachService: CoachService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.coachForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      documentType: ['', Validators.required],
      document: ['', Validators.required],
      idAppointments: [[]],
      idTrainingSheet: [[]],
    });
  }

  submitForm(): void {
    if (this.coachForm.valid) {
      const formValues = this.coachForm.value;
      const newCoach = {
        personalInformation: {
          name: formValues.name,
          surname: formValues.surname,
          documentType: formValues.documentType,
          document: formValues.document,
        },
        idAppointments: [],
        idTrainingSheet: [],
      };
      this.createCoach(newCoach);
    }
  }

  private createCoach(newCoach: any): void {
    this.isLoading = true; // Mostrar el spinner
    this._coachService.createCoach(newCoach).subscribe({
      next: (createdCoach: Coach) => {
        this.isLoading = false; // Ocultar el spinner
        console.log(createdCoach);
        if (createdCoach && createdCoach.id) {
          this.inputMessage = 'Coach created';
          this._router.navigate(['/coaches/detail', createdCoach.id]); // Redirigir a la página de detalles del atleta
        } else {
          console.error('El objeto creado no tiene un ID:', createdCoach);
        }
      },
      error: (error: any) => {
        console.error('Error al crear al Entrenador:', error);
      },
    });
  }
}
