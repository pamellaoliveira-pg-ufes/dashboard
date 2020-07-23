import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostMentionedByOwnerUsersComponent } from './most-mentioned-by-owner-users.component';

describe('MostMentionedByOwnerUsersComponent', () => {
  let component: MostMentionedByOwnerUsersComponent;
  let fixture: ComponentFixture<MostMentionedByOwnerUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostMentionedByOwnerUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostMentionedByOwnerUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
