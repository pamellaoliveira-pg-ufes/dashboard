import { Component, OnInit } from '@angular/core';
import { MessageService, convertToMoment } from 'src/app/core/services/message.service';
import { map, tap, takeUntil } from 'rxjs/operators';
import { msgDateOnRange } from '../messages-in-last-thirty-days/messages-in-last-thirty-days.component';
import { Message } from 'src/app/core/models/message';
import * as moment from 'moment';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subject } from 'rxjs';

@Component({
  selector: 'dash-messages-count-per-hour',
  templateUrl: './messages-count-per-hour.component.html',
  styleUrls: ['./messages-count-per-hour.component.scss']
})
export class MessagesCountPerHourComponent implements OnInit {

  private _unsubscribeAll = new Subject();
  isDataAvailable: boolean = false;

  private hourLabels = [...Array(24).keys()]
    .map(x =>
      moment()
        .startOf('day')
        .add(1, 'day')
        .subtract(x, 'hours')
        .startOf('hour'))
    .reverse();

  private data$ = this.messageService
    .getMessage()
    .pipe(
      map(messages => messages.filter(filterLast30DaysMessage)),
      map(messages => {
        return this.hourLabels.map(date => {
          const hourMsgs = messages.filter(msg => {
            const msgDate = convertToMoment(msg.timeSent).startOf('hour');
            return date.get('hours') == msgDate.get('hours');
          });
          return { date, hourMsgs: hourMsgs.length };
        })
      }),
      map((msgCounts: { date: moment.Moment, hourMsgs: number }[]) => {
        return msgCounts
          .map(msgCount => msgCount.hourMsgs);
      }),
      map(data => { return [{ data: data, label: 'Message count' }] as ChartDataSets[] }),
      tap(_ => this.isDataAvailable = true)
    );

  data: ChartDataSets[];
  labels = this.hourLabels
    .map(date => date.format('HH:mm'))
    .map(dateStr => dateStr as Label);
  

  public lineChartType = 'line';

  constructor(private messageService: MessageService) {
    this.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => this.data = data)
  }


  ngOnInit(): void {
  }

}

function filterLast30DaysMessage(msg: Message) {
  var today = moment().startOf('day').add(1, 'days');
  var thirtyDaysAgo = moment().startOf('day').subtract(30, 'days');

  return msgDateOnRange(msg, thirtyDaysAgo, today);
}