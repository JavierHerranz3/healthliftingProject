import { TestBed } from '@angular/core/testing';

import { CoachService } from './modules/coach/service/coach.service';

describe('CoachService', () => {
  let service: CoachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
