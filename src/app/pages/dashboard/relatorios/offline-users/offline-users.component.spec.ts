import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineUsersComponent } from './offline-users.component';

describe('OfflineUsersComponent', () => {
  let component: OfflineUsersComponent;
  let fixture: ComponentFixture<OfflineUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
