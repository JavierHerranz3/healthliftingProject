import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CoachService } from '../service/coach.service';

@Component({
  selector: 'app-coach-create',
  templateUrl: './coach-create.component.html',
  styleUrls: ['./coach-create.component.css'],
})
export class CoachCreateComponent implements OnInit {
  coachForm!: FormGroup;
  documentTypes: string[] = Object.values(DocumentType);
  inputMessage: string = '';

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
    this._coachService.createCoach(newCoach).subscribe({
      next: (value: any) => {
        this.inputMessage = 'Entrenador creado exitosamente';
        this._snackBar.open(this.inputMessage, 'Cerrar', {
          duration: 4000,
        });
        setTimeout(() => {
          this._router.navigate(['/coach/list']);
        }, 4000);
      },
      error: (error) => {
        console.error('Error al crear al Entrenador:', error);
      },
    });
  }
}
