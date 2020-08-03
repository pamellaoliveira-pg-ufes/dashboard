import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, of, Observable, Subject } from 'rxjs';
import { map, concatMap, tap, mergeMap, startWith } from 'rxjs/operators';

import { Channel } from 'src/app/core/models/channel';
import { ChannelService } from 'src/app/core/services/channel.service';
import { MessageService, filterByChannelId, groupByUsers, filterByDate } from 'src/app/core/services/message.service';
import { UserService } from 'src/app/core/services/user.service';
import { Message } from 'src/app/core/models/message';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'dash-users-messages-per-channel',
  templateUrl: './users-messages-per-channel.component.html',
  styleUrls: ['./users-messages-per-channel.component.scss']
})
export class UsersMessagesPerChannelComponent implements OnInit {

  private _currentChannel = new Subject<Channel>();
  currentChannel$ = this._currentChannel.asObservable();

  channels$ = this.channelService.getChannels();

  channelUsersMessagesCount$: Observable<{ name: string, msgCount: number }[]>;

  currentPage = 0;
  pageSize = 5;

  startDate = new FormControl(moment().subtract(30, 'days'));
  endDate = new FormControl(moment());

  constructor(private channelService: ChannelService,
    private messageService: MessageService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.channelUsersMessagesCount$ = combineLatest(this.messageService.getMessage(), this.currentChannel$, this.startDate.valueChanges.pipe(startWith(moment().subtract(30, 'days'))), this.endDate.valueChanges.pipe(startWith(moment())))
      .pipe(
        map(values => {
          const channel = values[1];
          const messages = filterByChannelId(values[0], channel.id)
            .filter(msg => filterByDate(msg, values[2], values[3]));

          return { messages, channel };
        }),
        map(values => {
          const filteredMessages = values.messages
          const channel = values.channel;

          return { groupedMessages: groupByUsers(filteredMessages), channel }
        }),
        mergeMap(values => {
          const channel = values.channel;

          console.log("first concatMap");

          if (channel.type == "private")
            return this.privateChannelEvaluation(of(values));

          return this.publicChannelEvaluation(of(values));
        }),
        mergeMap(userEmailMsgCountList => {
          console.log("seconds/third concatMap");
          return combineLatest(of(userEmailMsgCountList), this.userService.getUsers());
        }),
        map(values => {
          const userEmailMsgCountList = values[0];
          const users = values[1];

          return userEmailMsgCountList.map(userEmailMsgCount => {
            var user = users.filter(u => u.email == userEmailMsgCount.userEmail).pop()
            return {
              name: `${user.firstName} ${user.lastName}`,
              msgCount: userEmailMsgCount.msgCount as number
            }
          });
        }),
      )
  }

  private privateChannelEvaluation(observable: Observable<{ groupedMessages: Map<string, Message[]>, channel }>) {
    return observable.pipe(
      map(values => {
        const channel = values.channel;
        const groupedMessages = values.groupedMessages;

        var channelUsers = [...channel.guests || []];
        if (channel.owner)
          channelUsers.push(channel.owner);

        return countUserMessages(channelUsers, groupedMessages);
      }))
  }

  private publicChannelEvaluation(observable: Observable<{ groupedMessages: Map<string, Message[]>, channel }>) {
    return observable.pipe(
      mergeMap(values => {
        return combineLatest(of(values), this.userService.getUsers());
      }),
      map(values => {
        const users = values[1];
        const groupedMessages = values[0].groupedMessages;

        return countUserMessages(users.map(u => u.email), groupedMessages);
      }))
  }

  updateCurrentChannel(channel: Channel) {
    this._currentChannel.next(channel);
  }

  updatePage($event : PageEvent) {
    this.currentPage = $event.pageIndex;
  }
}

function countUserMessages(userEmails: string[], groupedMessages: Map<string, Message[]>): { userEmail: string, msgCount: number }[] {
  return userEmails.map(userEmail => {

    const messages = groupedMessages.get(userEmail);
    const msgCount = messages ? messages.length : 0;

    return { userEmail: userEmail, msgCount }
  })
    .sort(compareByMessageCount);
}

function compareByMessageCount(a: { userEmail: string, msgCount: number }, b: { userEmail: string, msgCount: number }) {
  return b.msgCount - a.msgCount;
}
