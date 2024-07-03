import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AthleteService } from '../../service/athlete.service';
import { Router } from '@angular/router';
import { DocumentType } from '../../../../core/models/athlete.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private _snackBar: MatSnackBar
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
        appointmentId: [],
        medicalRecordId: [],
      };
      this.createAthlete(newAthlete);
    }
  }

  private createAthlete(newAthlete: any): void {
    this._athleteService.createAthlete(newAthlete).subscribe({
      next: (value: any) => {
        this.inputMessage = 'Atleta creado exitosamente';
        this._snackBar.open(this.inputMessage, 'Cerrar', {
          duration: 4000,
        });
        setTimeout(() => {
          this._router.navigate(['/athletes/list']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al crear al Atleta:', error);
      },
    });
  }
}
