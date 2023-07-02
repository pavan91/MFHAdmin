import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsUsComponent } from './contacts-us.component';

describe('ContactsUsComponent', () => {
  let component: ContactsUsComponent;
  let fixture: ComponentFixture<ContactsUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsUsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
