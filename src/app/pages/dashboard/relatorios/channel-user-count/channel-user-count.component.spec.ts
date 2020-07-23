import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelUserCountComponent } from './channel-user-count.component';

describe('ChannelUserCountComponent', () => {
  let component: ChannelUserCountComponent;
  let fixture: ComponentFixture<ChannelUserCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelUserCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelUserCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
