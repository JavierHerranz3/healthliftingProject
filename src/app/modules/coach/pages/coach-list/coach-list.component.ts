import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoachService } from '../../service/coach.service';
import { Coach } from '../../../../core/models/coach.model';

@Component({
  selector: 'app-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css'],
})
export class CoachListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'surname', 'documentType', 'document'];
  dataSource = new MatTableDataSource<Coach>();
  searchControl = new FormControl('');
  filteredDataSource = new MatTableDataSource<Coach>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private coachService: CoachService) {}

  ngOnInit(): void {
    this.getCoaches();
    this.searchControl.valueChanges.subscribe((value) =>
      this.applyFilter(value || '')
    );
  }

  getCoaches(): void {
    this.coachService.getCoaches().subscribe((coaches: Coach[]) => {
      this.dataSource.data = coaches;
      this.filteredDataSource.data = coaches;
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
