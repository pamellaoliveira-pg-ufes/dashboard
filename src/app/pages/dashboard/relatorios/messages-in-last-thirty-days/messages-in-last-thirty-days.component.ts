import { Component, OnInit, OnDestroy } from '@angular/core';

import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';
import { map, tap, takeUntil } from 'rxjs/operators';
import { MessageService, convertToMoment, groupByDate } from 'src/app/core/services/message.service';
import { Message } from 'src/app/core/models/message';
import { Subject } from 'rxjs';


@Component({
  selector: 'dash-messages-in-last-thirty-days',
  templateUrl: './messages-in-last-thirty-days.component.html',
  styleUrls: ['./messages-in-last-thirty-days.component.scss']
})
export class MessagesInLastThirtyDaysComponent implements OnInit, OnDestroy {

  private _unsubscribeAll = new Subject();

  isDataAvailable:boolean = false;
  private dateLabels = [...Array(31).keys()]
    .map(x =>
      moment()
        .startOf('day')
        .subtract(x, 'days'))
    .reverse();

  data: ChartDataSets[];
  private data$ = this.messageService.getMessage()
    .pipe(map(messages => {
      return messages
        .filter(msg => msgDateOnRange(msg, this.dateLabels[0], moment(this.dateLabels[30]).add(1, 'day')))
    }),
      map(messages => {
        return this.dateLabels.map(date => {
          const dayMsgs = messages.filter(msg => {
            const msgDate = convertToMoment(msg.timeSent).startOf('day');
            return date.diff(msgDate) == 0;
          });
          return {date, msgCount: dayMsgs.length};
        })
      }),
      map((msgCounts :  {date: moment.Moment, msgCount: number}[]) => {
        return msgCounts
          .map(msgCount => msgCount.msgCount);
      }),
      map(data => { return [{ data: data, label: 'Message count' }] as ChartDataSets[] }),
      tap(_ => this.isDataAvailable = true));

  labels = this.dateLabels
    .map(date => date.format('MMM DD'))
    .map(dateStr => dateStr as Label);


  public lineChartType = 'line';

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => this.data = data)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
  }
}

export function msgDateOnRange(message: Message, startDate: moment.Moment, endDate: moment.Moment) {
  const msgDate = convertToMoment(message.timeSent);

  return msgDate >= startDate && msgDate <= endDate;
}
