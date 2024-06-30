import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteCreateComponent } from './athlete-create.component';

describe('AthleteCreateComponent', () => {
  let component: AthleteCreateComponent;
  let fixture: ComponentFixture<AthleteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AthleteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
