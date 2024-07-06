import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSheetListComponent } from './training-sheet-list.component';

describe('TrainingSheetListComponent', () => {
  let component: TrainingSheetListComponent;
  let fixture: ComponentFixture<TrainingSheetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingSheetListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingSheetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
