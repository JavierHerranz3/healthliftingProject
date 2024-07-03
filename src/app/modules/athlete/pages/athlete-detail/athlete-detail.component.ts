import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Athlete } from '../../../../core/models/athlete.model';
import { Appointment } from '../../../../core/models/appointment.model';
import { AthleteService } from '../../service/athlete.service';

@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.component.html',
  styleUrls: ['./athlete-detail.component.css'],
})
export class AthleteDetailComponent implements OnInit {
  protected id: string = '';
  protected athlete: Athlete | undefined;
  protected dataSource = new MatTableDataSource<Athlete>();
  protected appointmentsDataSource = new MatTableDataSource<Appointment>(); // DataSource para las citas
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'document'];
  protected appointmentDisplayedColumns: string[] = [
    'id',
    'date',
    'coachName',
    'coachSurname',
    'trainingType',
  ];
  protected activeAppointmentsCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _athleteService: AthleteService,
    private _route: ActivatedRoute,
    private _routerNav: Router
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id']; // Obtén el ID del atleta de los parámetros de la URL
      this.getAthleteById(this.id);
      this.dataSource.paginator = this.paginator;
    });
  }

  getAthleteById(id: string): void {
    this._athleteService.getAthleteById(id).subscribe({
      next: (value) => {
        this.athlete = value;
        console.log('Athlete fetched', value);
      },
      error: (err) => {
        console.error('Error fetching athlete', err);
      },
    });
  }

  deleteAthlete(): void {
    this._athleteService.deleteAthlete(this.id).subscribe({
      next: () => {
        console.log('Athlete deleted successfully');
        this._routerNav.navigate(['/athletes/list']);
      },
      error: (error) => {
        console.error('Error deleting athlete', error);
      },
    });
  }
}
