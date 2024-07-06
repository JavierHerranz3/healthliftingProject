import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TrainingSheetService } from '../../service/training-sheet.service';
import { TrainingSheet } from '../../../../core/models/trainingSheet.model';

@Component({
  selector: 'app-training-sheet-detail',
  templateUrl: './training-sheet-detail.component.html',
  styleUrls: ['./training-sheet-detail.component.css'],
})
export class TrainingSheetDetailComponent implements OnInit {
  protected id: string = '';
  protected trainingSheet?: TrainingSheet;
  protected dataSource = new MatTableDataSource<TrainingSheet>();
  protected page?: { content: TrainingSheet[]; totalElements: number };
  protected displayedColumns: string[] = [
    'id',
    'trainingType',
    'observations',
    'coachId',
    'athleteId',
  ];
  protected isEditing = false; // Nueva variable para controlar el estado de edición

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _trainingSheetService: TrainingSheetService,
    private _route: ActivatedRoute,
    private _routerNav: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id']; // Obtén el ID de la ficha de entrenamiento de los parámetros de la URL
      this.getTrainingSheetById(this.id);
      this.dataSource.paginator = this.paginator;
    });
  }

  getTrainingSheetById(id: string): void {
    this._trainingSheetService.getTrainingSheetById(id).subscribe({
      next: (value) => {
        this.trainingSheet = value;
        console.log('Training sheet fetched', value);
      },
      error: (err) => {
        console.error('Error fetching training sheet', err);
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTrainingSheet();
      }
    });
  }

  deleteTrainingSheet(): void {
    this._trainingSheetService.deleteTrainingSheet(this.id).subscribe({
      next: () => {
        console.log('Training sheet deleted successfully');
        this._routerNav.navigate(['']);
      },
      error: (error) => {
        console.error('Error deleting training sheet', error);
      },
    });
  }

  saveChanges(): void {
    if (this.trainingSheet) {
      this._trainingSheetService
        .updateTrainingSheet(this.id, this.trainingSheet)
        .subscribe({
          next: () => {
            console.log('Training sheet updated successfully');
            this.toggleEdit();
            this._snackBar.open(
              'Ficha de entrenamiento actualizada correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          },
          error: (err) => {
            console.error('Error updating training sheet', err);
          },
        });
    }
  }

  modifyTrainingSheet(): void {
    this.toggleEdit();
  }
}
