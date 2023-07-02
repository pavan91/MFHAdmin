import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingItieanaryComponent } from './trending-itieanary.component';

describe('TrendingItieanaryComponent', () => {
  let component: TrendingItieanaryComponent;
  let fixture: ComponentFixture<TrendingItieanaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingItieanaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingItieanaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
