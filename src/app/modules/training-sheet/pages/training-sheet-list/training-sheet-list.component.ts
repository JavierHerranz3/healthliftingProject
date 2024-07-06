import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TrainingSheet } from '../../../../core/models/trainingSheet.model';
import { TrainingSheetService } from '../../service/training-sheet.service';

@Component({
  selector: 'app-training-sheet-list',
  templateUrl: './training-sheet-list.component.html',
  styleUrls: ['./training-sheet-list.component.css'],
})
export class TrainingSheetListComponent implements OnInit {
  public dataSource = new MatTableDataSource<TrainingSheet>();
  public displayedColumns: string[] = [
    'id',
    'trainingType',
    'observations',
    'coachId',
    'athleteId',
  ];
  public searchControl = new FormControl();
  public errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private trainingSheetService: TrainingSheetService
  ) {}

  ngOnInit(): void {
    this.getTrainingSheets(0, 20);
    this.dataSource.paginator = this.paginator;
  }

  getTrainingSheets(page: number, size: number): void {
    this.trainingSheetService.getTrainingSheets(page, size).subscribe({
      next: (value) => {
        if (value && value.content) {
          this.dataSource.data = value.content;
          if (this.paginator) {
            this.paginator.length = value.totalElements;
          }
        } else {
          console.error('Invalid response structure', value);
        }
      },
      error: (err) => {
        console.error('Error fetching training sheets', err);
      },
    });
  }

  searchTrainingSheetById(): void {
    const id = this.searchControl.value;
    if (id) {
      this.trainingSheetService.getTrainingSheetById(id).subscribe({
        next: (trainingSheet) => {
          if (trainingSheet && trainingSheet.id) {
            this.router.navigateByUrl(
              `/training-sheets/detail/${trainingSheet.id}`
            );
          } else {
            this.errorMessage =
              'No existe una ficha de entrenamiento con ese ID';
          }
        },
        error: (error) => {
          console.error('Error fetching training sheet by ID', error);
          this.errorMessage = 'No existe una ficha de entrenamiento con ese ID';
        },
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un ID válido';
    }
  }

  public onPageChange(event: any): void {
    this.getTrainingSheets(event.pageIndex, event.pageSize);
  }
}
