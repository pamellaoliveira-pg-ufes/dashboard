import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesInLastThirtyDaysComponent } from './messages-in-last-thirty-days.component';

describe('MessagesInLastThirtyDaysComponent', () => {
  let component: MessagesInLastThirtyDaysComponent;
  let fixture: ComponentFixture<MessagesInLastThirtyDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesInLastThirtyDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesInLastThirtyDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
