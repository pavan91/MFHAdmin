import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateItineraryComponent } from './update-itinerary.component';

describe('UpdateItineraryComponent', () => {
  let component: UpdateItineraryComponent;
  let fixture: ComponentFixture<UpdateItineraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateItineraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
