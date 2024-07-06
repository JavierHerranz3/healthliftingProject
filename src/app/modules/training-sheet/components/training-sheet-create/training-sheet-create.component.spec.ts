import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSheetCreateComponent } from './training-sheet-create.component';

describe('TrainingSheetCreateComponent', () => {
  let component: TrainingSheetCreateComponent;
  let fixture: ComponentFixture<TrainingSheetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingSheetCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingSheetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
