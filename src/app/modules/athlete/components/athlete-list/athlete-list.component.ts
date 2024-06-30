import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Athlete } from '../../../../core/models/athlete.model';
import { AthleteService } from '../../service/athlete.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-athlete-list',
  templateUrl: './athlete-list.component.html',
  styleUrl: './athlete-list.component.css',
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
  dataSource: MatTableDataSource<Athlete> = new MatTableDataSource<Athlete>();
  athletes: Athlete[] = [];
  filteredAthletes: Athlete[] = [];
  searchControl: FormControl;
  isSearchVisible = false;
  isTableVisible = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private athleteService: AthleteService, private fb: FormBuilder) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.athleteService.getAthletes().subscribe((data) => {
      this.athletes = data;
      this.dataSource.data = this.athletes;
    });

    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this.filterAthletes(value))
      )
      .subscribe((filtered) => {
        this.filteredAthletes = filtered;
        this.dataSource.data = this.filteredAthletes;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }

  showTable(): void {
    this.isTableVisible = true;
  }

  filterAthletes(value: string): Athlete[] {
    const filterValue = value.toLowerCase();
    return this.athletes.filter(
      (athlete) =>
        athlete.personalInformation.name.toLowerCase().includes(filterValue) ||
        athlete.personalInformation.surname.toLowerCase().includes(filterValue)
    );
  }
}
