import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMessagesPerChannelComponent } from './users-messages-per-channel.component';

describe('UsersMessagesPerChannelComponent', () => {
  let component: UsersMessagesPerChannelComponent;
  let fixture: ComponentFixture<UsersMessagesPerChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersMessagesPerChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersMessagesPerChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
