import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSendedMessageElapsedTimeComponent } from './last-sended-message-elapsed-time.component';

describe('LastSendedMessageElapsedTimeComponent', () => {
  let component: LastSendedMessageElapsedTimeComponent;
  let fixture: ComponentFixture<LastSendedMessageElapsedTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastSendedMessageElapsedTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastSendedMessageElapsedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
