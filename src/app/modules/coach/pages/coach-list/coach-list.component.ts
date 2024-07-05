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
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value) =>
          this.coachService.searchCoachesByDocument(value ?? '')
        )
      )
      .subscribe({
        next: (coaches) => {
          this.filteredCoaches = coaches;
        },
        error: (error) => {
          console.error('Error searching coaches:', error);
        },
      });

    this.getCoaches();
  }

  getCoaches(): void {
    this.coachService.getCoaches(0, 10).subscribe((page: Page<Coach>) => {
      this.dataSource.data = page.content;
      this.dataSource.paginator = this.paginator;
    });
  }

  goToDetail(coach: Coach): void {
    if (coach && coach.id) {
      this.router.navigate([`/coach/detail/${coach.id}`]);
    }
  }
}
