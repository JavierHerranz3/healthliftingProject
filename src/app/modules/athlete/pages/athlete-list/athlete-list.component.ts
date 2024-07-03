import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AthleteService } from '../../service/athlete.service';
import { Athlete } from '../../../../core/models/athlete.model';

@Component({
  selector: 'app-athlete-list',
  templateUrl: './athlete-list.component.html',
  styleUrls: ['./athlete-list.component.css'],
})
export class AthleteListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'surname',
    'age',
    'height',
    'documentType',
    'document',
  ];
  dataSource = new MatTableDataSource<Athlete>();
  searchControl = new FormControl('');
  filteredDataSource = new MatTableDataSource<Athlete>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private athleteService: AthleteService) {}

  ngOnInit(): void {
    this.getAthletes();
    this.searchControl.valueChanges.subscribe((value) =>
      this.applyFilter(value || '')
    );
  }

  getAthletes(): void {
    this.athleteService.getAthletes().subscribe((athletes: Athlete[]) => {
      this.dataSource.data = athletes;
      this.filteredDataSource.data = athletes;
      this.filteredDataSource.paginator = this.paginator;
      this.filteredDataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string): void {
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    if (this.filteredDataSource.paginator) {
      this.filteredDataSource.paginator.firstPage();
    }
  }
}
