import { TestBed } from '@angular/core/testing';

import { TrainingSheetService } from './training-sheet.service';

describe('TrainingSheetService', () => {
  let service: TrainingSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
