import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCreationContainerComponent } from './coach-creation-container.component';

describe('CoachCreationComponentComponent', () => {
  let component: CoachCreationContainerComponent;
  let fixture: ComponentFixture<CoachCreationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCreationContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoachCreationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
