import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagRoadPage } from './tag-road.page';

describe('TagRoadPage', () => {
  let component: TagRoadPage;
  let fixture: ComponentFixture<TagRoadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TagRoadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
