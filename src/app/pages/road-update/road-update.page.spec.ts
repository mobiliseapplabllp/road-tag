import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoadUpdatePage } from './road-update.page';

describe('RoadUpdatePage', () => {
  let component: RoadUpdatePage;
  let fixture: ComponentFixture<RoadUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
