import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AthleteService, Page } from '../../service/athlete.service';
import { Athlete } from '../../../../core/models/athlete.model';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private athleteService: AthleteService) {}

  ngOnInit(): void {
    this.loadAthletes(0, 10); // Cargar la primera página con tamaño 10 por defecto
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() =>
      this.loadAthletes(this.paginator.pageIndex, this.paginator.pageSize)
    );
  }

  loadAthletes(page: number, size: number): void {
    this.athleteService.getAthletes(page, size).subscribe({
      next: (pageData: Page<Athlete>) => {
        this.dataSource.data = pageData.content;
        this.totalElements = pageData.totalElements;
      },
      error: (error) => {
        console.error('Error fetching athletes:', error);
      },
    });
  }
}
