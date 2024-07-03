import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteDetailComponent } from './athlete-detail.component';

describe('AthleteDetailComponent', () => {
  let component: AthleteDetailComponent;
  let fixture: ComponentFixture<AthleteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AthleteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
