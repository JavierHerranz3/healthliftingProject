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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private coachService: CoachService, private router: Router) {}

  ngOnInit(): void {
    this.getCoaches(0, 20);
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

  goToDetail(coach: Coach): void {
    if (coach && coach.id) {
      this.router.navigate([`/coach/detail/${coach.id}`]);
    }
  }
}
