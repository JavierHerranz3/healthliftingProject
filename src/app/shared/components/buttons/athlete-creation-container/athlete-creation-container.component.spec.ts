import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteCreationContainerComponent } from './athlete-creation-container.component';

describe('AthleteCreationContainerComponent', () => {
  let component: AthleteCreationContainerComponent;
  let fixture: ComponentFixture<AthleteCreationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteCreationContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AthleteCreationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
