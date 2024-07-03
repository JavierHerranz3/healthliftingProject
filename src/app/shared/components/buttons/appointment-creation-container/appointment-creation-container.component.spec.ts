import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCreationContainerComponent } from './appointment-creation-container.component';

describe('AppointmentCreationContainerComponent', () => {
  let component: AppointmentCreationContainerComponent;
  let fixture: ComponentFixture<AppointmentCreationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCreationContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentCreationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
