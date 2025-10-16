import { TestBed } from '@angular/core/testing';

import { RoadTag } from './road-tag';

describe('RoadTag', () => {
  let service: RoadTag;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoadTag);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
