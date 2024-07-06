import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSheetDetailComponent } from './training-sheet-detail.component';

describe('TrainingSheetDetailComponent', () => {
  let component: TrainingSheetDetailComponent;
  let fixture: ComponentFixture<TrainingSheetDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingSheetDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingSheetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
