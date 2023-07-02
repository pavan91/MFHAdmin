import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingInternationalComponent } from './trending-international.component';

describe('TrendingInternationalComponent', () => {
  let component: TrendingInternationalComponent;
  let fixture: ComponentFixture<TrendingInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingInternationalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
