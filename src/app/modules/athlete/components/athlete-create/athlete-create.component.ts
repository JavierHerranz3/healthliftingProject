import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AthleteService } from '../../service/athlete.service';
import { Router } from '@angular/router';
import { Athlete, DocumentType } from '../../../../core/models/athlete.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-athlete-create',
  templateUrl: './athlete-create.component.html',
  styleUrl: './athlete-create.component.css',
})
export class AthleteCreateComponent implements OnInit {
  athleteForm: FormGroup;
  documentTypes: string[] = Object.values(DocumentType);

  constructor(
    private fb: FormBuilder,
    private athleteService: AthleteService,
    private router: Router
  ) {
    this.athleteForm = this.fb.group({
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

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.athleteForm.valid) {
      const newAthlete: Athlete = {
        ...this.athleteForm.value,
        id: '', // El id puede ser asignado por el backend o por algún otro mecanismo
      };
      this.athleteService.createAthlete(newAthlete).subscribe(
        (athlete: Athlete) => {
          alert('El atleta ha sido creado correctamente.');
          this.router.navigate(['/athletes', athlete.id]);
        },
        (error: any) => {
          alert(
            'Hubo un error al crear el atleta. Por favor, intenta nuevamente.'
          );
        }
      );
    }
  }
}
