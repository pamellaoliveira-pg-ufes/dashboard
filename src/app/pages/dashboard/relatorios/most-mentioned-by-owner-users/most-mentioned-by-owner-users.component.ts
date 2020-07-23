import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/app/core/models/channel';
import { Subject, combineLatest, of } from 'rxjs';
import { MessageService, groupByUsers } from 'src/app/core/services/message.service';
import { map, mergeMap, tap, takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChannelService } from 'src/app/core/services/channel.service';

@Component({
  selector: 'dash-most-mentioned-by-owner-users',
  templateUrl: './most-mentioned-by-owner-users.component.html',
  styleUrls: ['./most-mentioned-by-owner-users.component.scss']
})
export class MostMentionedByOwnerUsersComponent implements OnInit {

  private _unsubscribeAll = new Subject();

  isDataAvailable:boolean = false;

  private _currentChannel = new Subject<Channel>();
  currentChannel$ = this._currentChannel.asObservable();
  
  channels$ = this.channelService
    .getChannels()
    .pipe(map(channels => channels.filter(c => c.type == "private")))

  private $mostMentionedByOwnerUsers = combineLatest(this.messageService.getMessage(), this.currentChannel$)
    .pipe(
      map(values => {
        const channel = values[1];
        const messages = values[0]
          .filter(msg => msg.channel == channel.id) //filtra por canal
          .filter(msg => msg.email == channel.owner) // filtra msg mandada pelo professor
          .filter(msg => msg.taggedUsers?.length > 0); // filtra se tiver usuários marcados

          return { messages, channel };
      }),
      map(values => {
        const filteredMessages = values.messages;
        const userEmails: string[] = [];

        filteredMessages.forEach(msg => {
          msg.taggedUsers.forEach(email => userEmails.push(email));
        });

        return userEmails;
      }),
      map(userEmails => {
        const userEmailsCount: {email: string, count: number}[] = [];

        userEmails.forEach(email => {
          var founded = userEmailsCount.filter(i => i.email == email).pop();
          
          if (founded)
            founded.count++;
          else
            userEmailsCount.push({email, count: 1});
        });
        return userEmailsCount;
      }),
      mergeMap(userEmailsCount => {
        return combineLatest(of(userEmailsCount), this.userService.getUsers());
      }),
      map(values => {
        const userEmailsCount = values[0];
        const users = values[1]
          .filter(u => 
            userEmailsCount
              .filter(uc => uc.email == u.email)?.length > 0);

        return userEmailsCount.map(uc => {
          var user = users.filter(u => u.email == uc.email).pop();
          return {
            name: `${user.firstName} ${user.lastName}`,
            count: uc.count
          }
        })
        
      }),
      tap(data => console.log("result:", data)),
      tap(_ => this.isDataAvailable = true));

  data: ChartDataSets[];
  labels: Label[];
  
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { 
      xAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 5,
        }
      }], 
      yAxes: [{}] 
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartType: string = 'horizontalBar';
  
  constructor(private messageService: MessageService,
    private userService: UserService,
    private channelService: ChannelService) { }

  ngOnInit(): void {
    this.$mostMentionedByOwnerUsers
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
    
      this.data = data
          .map(item => { return { label: item.name, data: [item.count] } });
    })
  }

  updateCurrentChannel(channel: Channel) {
    this._currentChannel.next(channel);
  }

}
