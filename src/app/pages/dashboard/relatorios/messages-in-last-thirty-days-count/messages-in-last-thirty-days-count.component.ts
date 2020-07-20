import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { map } from 'rxjs/operators';

import { MessageService } from 'src/app/core/services/message.service';
import { msgDateOnRange } from '../messages-in-last-thirty-days/messages-in-last-thirty-days.component';

@Component({
  selector: 'dash-messages-in-last-thirty-days-count',
  templateUrl: './messages-in-last-thirty-days-count.component.html',
  styleUrls: ['./messages-in-last-thirty-days-count.component.scss']
})
export class MessagesInLastThirtyDaysCountComponent implements OnInit {

  today = moment().startOf('day');
  thirtyDaysAgo = moment().startOf('day').subtract(30, 'days');

  msgCount$ = this.messageService.getMessage()
    .pipe(map(messages => {
      return messages
        .filter(msg => msgDateOnRange(msg, this.thirtyDaysAgo, this.today))
    }),
    map(messages => messages.length));

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    console.log(this.today);
    console.log(this.thirtyDaysAgo);
  }

}
