import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoachService } from '../../service/coach.service';
import { Coach } from '../../../../core/models/coach.model';
import { debounceTime, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Page } from '../../../../core/models/page.model';

@Component({
  selector: 'app-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css'],
})
export class CoachListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'surname', 'documentType', 'document'];
  dataSource = new MatTableDataSource<Coach>();
  searchControl = new FormControl('');
  filteredCoaches: Coach[] = [];
  coaches: Coach[] = [];
  public errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private coachService: CoachService, private router: Router) {}

  ngOnInit(): void {
    this.getCoaches(0, 5);
    this.dataSource.paginator = this.paginator;
  }

  getCoaches(page: number, size: number): void {
    this.coachService.getCoaches(page, size).subscribe({
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
        console.error('Error fetching coaches', err);
      },
    });
  }

  searchCoachByDocument(): void {
    const document = this.searchControl.value;
    if (document) {
      this.coachService.searchCoachByDocument(document).subscribe({
        next: (coach: Coach) => {
          if (coach) {
            this.coaches = [coach];
            this.dataSource.data = this.coaches;
            this.errorMessage = null;
          } else {
            this.errorMessage = 'No existe entrenador con ese documento.';
            this.searchControl.setValue('');
            this.getCoaches(0, 5);
          }
        },
        error: (err) => {
          console.error('Error fetching coach by document', err);
          this.errorMessage = 'No existe entrenador con ese documento.';
          this.searchControl.setValue('');
          this.getCoaches(0, 5);
        },
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un documento válido.';
      this.searchControl.setValue('');
      this.getCoaches(0, 5);
    }
  }
  public onPageChange(event: any): void {
    this.getCoaches(event.pageIndex, event.pageSize);
  }
  goToDetail(coach: Coach): void {
    if (coach && coach.id) {
      this.router.navigate([`/coaches/detail/${coach.id}`]);
    }
  }
}
