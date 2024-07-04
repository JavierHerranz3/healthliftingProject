import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AthleteService } from '../../service/athlete.service';
import { Router } from '@angular/router';
import { Athlete, DocumentType } from '../../../../core/models/athlete.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-athlete-create',
  templateUrl: './athlete-create.component.html',
  styleUrls: ['./athlete-create.component.css'],
})
export class AthleteCreateComponent implements OnInit {
  athleteForm!: FormGroup;
  documentTypes: string[] = Object.values(DocumentType);
  inputMessage: string = '';

  constructor(
    private _fb: FormBuilder,
    private _athleteService: AthleteService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.athleteForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      documentType: ['', Validators.required],
      document: ['', Validators.required],
      age: ['', Validators.required],
      height: ['', Validators.required],
      idAppointments: [[]],
      idTrainingSheet: [[]],
    });
  }

  submitForm(): void {
    if (this.athleteForm.valid) {
      const formValues = this.athleteForm.value;
      const newAthlete = {
        personalInformation: {
          name: formValues.name,
          surname: formValues.surname,
          documentType: formValues.documentType,
          document: formValues.document,
        },
        age: formValues.age,
        height: formValues.height,
        idAppointments: [],
        idTrainingSheet: [],
      };
      this.createAthlete(newAthlete);
    }
  }

  private createAthlete(newAthlete: any): void {
    //mostrar estado de carga
    this._athleteService.createAthlete(newAthlete).subscribe({
      next: (createdAthlete: Athlete) => {
        console.log(createdAthlete);
        // if (createdAthlete && createdAthlete.id) {
        //   this.inputMessage = 'Atleta creado';

        //   // quitas el estado de carga
        //   console.log(createdAthlete);
        //   this._router.navigate(['/athletes/detail', createdAthlete.id]); // Redirigir a la página de detalles del atleta
        // } else {
        //   console.error('El objeto creado no tiene un ID:', createdAthlete);
        // }
      },
      error: (error) => {
        console.error('Error al crear al Atleta:', error);
      },
    });
  }
}
