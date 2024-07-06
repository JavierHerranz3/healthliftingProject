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
    'personalInformation.document',
    'personalInformation.name',
    'personalInformation.surname',
  ];
  public searchControl = new FormControl();
  public errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private athleteService: AthleteService) {}

  ngOnInit(): void {
    this.getAthletes(0, 20);
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
      this.athleteService.getAthleteByDocument(document).subscribe({
        next: (athlete) => {
          if (athlete && athlete.id) {
            this.router.navigateByUrl(`/athlete/detail/${athlete.id}`);
          } else {
            this.errorMessage = 'No existe un atleta con ese documento';
          }
        },
        error: (error) => {
          console.error('Error fetching athlete by document', error);
          this.errorMessage = 'No existe un atleta con ese documento';
        },
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un documento válido';
    }
  }

  public onPageChange(event: any): void {
    this.getAthletes(event.pageIndex, event.pageSize);
  }
}
