import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoadTagPage } from './road-tag.page';

describe('RoadTagPage', () => {
  let component: RoadTagPage;
  let fixture: ComponentFixture<RoadTagPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadTagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
