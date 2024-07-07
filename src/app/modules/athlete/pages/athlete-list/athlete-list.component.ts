import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { FormControl } from '@angular/forms';
import { Athlete } from '../../../../core/models/athlete.model';
import { AthleteService } from '../../service/athlete.service';

@Component({
  selector: 'app-athlete-list',
  templateUrl: './athlete-list.component.html',
  styleUrls: ['./athlete-list.component.css'],
})
export class AthleteListComponent implements OnInit {
  public dataSource = new MatTableDataSource<Athlete>();
  public displayedColumns: string[] = [
    'name',
    'surname',
    'age',
    'height',
    'document',
  ];
  public searchControl = new FormControl();
  athletes: Athlete[] = [];

  public errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private athleteService: AthleteService) {}

  ngOnInit(): void {
    this.getAthletes(0, 5);
    this.dataSource.paginator = this.paginator;
  }

  getAthletes(page: number, size: number): void {
    this.athleteService.getAthletes(page, size).subscribe({
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
        console.error('Error fetching athletes', err);
      },
    });
  }

  searchAthleteByDocument(): void {
    const document = this.searchControl.value;
    if (document) {
      this.athleteService.searchAthleteByDocument(document).subscribe({
        next: (athlete: Athlete) => {
          if (athlete) {
            this.athletes = [athlete];
            this.dataSource.data = this.athletes;
            this.errorMessage = null;
          } else {
            this.errorMessage = 'No existe atleta con ese documento.';
            this.searchControl.setValue('');
            this.getAthletes(0, 5);
          }
        },
        error: (err) => {
          console.error('Error fetching athlete by document', err);
          this.errorMessage =
            'No se encontró un atleta con el documento proporcionado.';
          this.searchControl.setValue('');
          this.getAthletes(0, 5);
        },
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un documento válido.';
      this.searchControl.setValue('');
      this.getAthletes(0, 5);
    }
  }

  public onPageChange(event: any): void {
    this.getAthletes(event.pageIndex, event.pageSize);
  }

  goToDetail(athlete: Athlete): void {
    if (athlete && athlete.id) {
      this.router.navigate([`/athletes/detail/${athlete.id}`]);
    }
  }
}
