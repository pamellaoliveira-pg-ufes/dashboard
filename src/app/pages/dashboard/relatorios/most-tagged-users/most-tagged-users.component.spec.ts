import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostTaggedUsersComponent } from './most-tagged-users.component';

describe('MostTaggedUsersComponent', () => {
  let component: MostTaggedUsersComponent;
  let fixture: ComponentFixture<MostTaggedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostTaggedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostTaggedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
