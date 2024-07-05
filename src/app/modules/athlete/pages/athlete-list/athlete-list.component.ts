import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AthleteService, Page } from '../../service/athlete.service';
import { Athlete } from '../../../../core/models/athlete.model';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-athlete-list',
  templateUrl: './athlete-list.component.html',
  styleUrls: ['./athlete-list.component.css'],
})
export class AthleteListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'surname',
    'age',
    'height',
    'documentType',
    'document',
  ];
  dataSource = new MatTableDataSource<Athlete>();
  totalElements = 0;
  searchControl = new FormControl();
  filteredAthletes: Athlete[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private filterSubject = new Subject<string>();

  constructor(private athleteService: AthleteService, private router: Router) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value) =>
          this.athleteService.searchAthletesByDocument(value ?? '')
        )
      )
      .subscribe({
        next: (athletes) => {
          this.filteredAthletes = athletes;
        },
        error: (error) => {
          console.error('Error searching athletes:', error);
        },
      });

    this.loadAthletes();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.loadAthletes());
    this.loadAthletes();
  }

  loadAthletes(): void {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 5;

    this.athleteService.getAthletes(pageIndex, pageSize).subscribe({
      next: (pageData: Page<Athlete>) => {
        this.dataSource.data = pageData.content;
        this.totalElements = pageData.totalElements;
        this.paginator.length = this.totalElements;
      },
      error: (error) => {
        console.error('Error fetching athletes:', error);
      },
    });
  }

  applyFilter(event: Event): void {
    const document = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = document;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  searchAthletesByDocument(document: string): void {
    this.athleteService.searchAthletesByDocument(document).subscribe({
      next: (athletes: Athlete[]) => {
        this.dataSource.data = athletes;
        this.totalElements = athletes.length;
        this.paginator.length = this.totalElements;
      },
      error: (error) => {
        console.error('Error searching athletes by document:', error);
      },
    });
  }

  goToDetail(athlete: Athlete): void {
    if (athlete && athlete.id) {
      this.router.navigate([`/athlete/detail/${athlete.id}`]);
    }
  }
}
