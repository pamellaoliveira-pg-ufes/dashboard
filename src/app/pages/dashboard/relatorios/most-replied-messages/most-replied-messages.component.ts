import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/core/services/channel.service';
import { MessageService, filterByDate } from 'src/app/core/services/message.service';
import { map, startWith, mergeMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Subject, combineLatest, of } from 'rxjs';
import { Channel } from 'src/app/core/models/channel';
import { Message } from 'src/app/core/models/message';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'dash-most-replied-messages',
  templateUrl: './most-replied-messages.component.html',
  styleUrls: ['./most-replied-messages.component.scss']
})
export class MostRepliedMessagesComponent implements OnInit {


  private _currentChannel = new Subject<Channel>();
  currentChannel$ = this._currentChannel.asObservable();
  
  startDate = new FormControl(moment().subtract(30, 'days'));
  endDate = new FormControl(moment());

  channels$ = this.channelService
    .getChannels()
    .pipe(map(channels => channels.filter(c => c.type == "private")));

  mostRepliedMessages$ = combineLatest(this.messageService.getMessage(), this.currentChannel$,
    this.startDate.valueChanges.pipe(startWith(moment().subtract(30, 'days'))), this.endDate.valueChanges.pipe(startWith(moment())))
    .pipe(map(values => {
      const messages = values[0];
      return messages.filter(msg => msg.channel == values[1].id)
        .filter(msg => filterByDate(msg, values[2], values[3]))
    }),
    map(messages => {
      var msgsReplyCount: {msg: Message, replyCount: number}[] = [];

      messages.forEach(msg => msgsReplyCount.push({msg, replyCount: 0}));
      
      msgsReplyCount.forEach(msgReplyCount => {
        messages.forEach(message => {
          if (msgReplyCount.msg.id == message.reply)
            msgReplyCount.replyCount++;
        })
      });

      return msgsReplyCount
        .filter(msg => msg.replyCount > 0)
        .sort((a,b) => b.replyCount - a.replyCount)
        .slice(0, 10);
    }),
    mergeMap(msgsReplyCount => {
      return combineLatest(of(msgsReplyCount), this.userService.getUsers())
    }),
    map(values => {
      const msgsReplyCount = values[0];
      const users = values[1];

      return msgsReplyCount.map(msgReplyCount => {
        const user = users.filter(u => u.email == msgReplyCount.msg.email).pop();
        const msg = msgReplyCount.msg.message?.length > 50 ? msgReplyCount.msg.message.slice(0, 50) + "..." : msgReplyCount.msg.message
        return {
          msg: `\"${msg}\"`,
          userName: `${user.firstName} ${user.lastName}`,
          replyCount: msgReplyCount.replyCount
        }
      })
    }))

  constructor(private channelService: ChannelService, 
    private messageService: MessageService,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  updateCurrentChannel(channel: Channel) {
    this._currentChannel.next(channel);
  }
}
