import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesCountPerHourComponent } from './messages-count-per-hour.component';

describe('MessagesCountPerHourComponent', () => {
  let component: MessagesCountPerHourComponent;
  let fixture: ComponentFixture<MessagesCountPerHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesCountPerHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesCountPerHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
