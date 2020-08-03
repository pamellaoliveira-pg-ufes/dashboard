import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostRepliedMessagesComponent } from './most-replied-messages.component';

describe('MostRepliedMessagesComponent', () => {
  let component: MostRepliedMessagesComponent;
  let fixture: ComponentFixture<MostRepliedMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostRepliedMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostRepliedMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
