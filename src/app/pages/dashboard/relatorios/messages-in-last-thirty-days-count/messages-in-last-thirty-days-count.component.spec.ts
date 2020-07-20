import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesInLastThirtyDaysCountComponent } from './messages-in-last-thirty-days-count.component';

describe('MessagesInLastThirtyDaysCountComponent', () => {
  let component: MessagesInLastThirtyDaysCountComponent;
  let fixture: ComponentFixture<MessagesInLastThirtyDaysCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesInLastThirtyDaysCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesInLastThirtyDaysCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
