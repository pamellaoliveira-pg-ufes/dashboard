import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Subject, Observable, combineLatest, of } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import { UserService } from 'src/app/core/services/user.service';
import { Channel } from 'src/app/core/models/channel';
import { ChannelService } from 'src/app/core/services/channel.service';
import { MessageService, filterByChannelId, groupByUsers, getLatestMessage, convertToMoment, compareByDate } from 'src/app/core/services/message.service';
import { Message } from 'src/app/core/models/message';
import * as moment from 'moment';

@Component({
  selector: 'dash-last-sended-message-elapsed-time',
  templateUrl: './last-sended-message-elapsed-time.component.html',
  styleUrls: ['./last-sended-message-elapsed-time.component.scss']
})
export class LastSendedMessageElapsedTimeComponent implements OnInit {


  private _currentChannel = new Subject<Channel>();
  currentChannel$ = this._currentChannel.asObservable();

  channels$ = this.channelService.getChannels();

  userLastSendedMessage$: Observable<{ name: string, lastMessageElapsedTime: string }[]>;

  currentPage = 0;
  pageSize = 5;

  constructor(private channelService: ChannelService,
    private messageService: MessageService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userLastSendedMessage$ = combineLatest(this.messageService.getMessage(), this.currentChannel$)
      .pipe(
        map(values => {
          const channel = values[1];
          const messages = filterByChannelId(values[0], channel.id);

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
            return this.privateChannelUsersEvaluation(of(values));

          return this.publicChannelUsersEvaluation(of(values));
        }),
        map(values => {
          const userEmails = values.userEmails;
          const groupedMessages = values.groupedMessages;

          return userEmails.map(userEmail => {
            const messages = groupedMessages.get(userEmail);
            const lastMessage = getLatestMessage(messages);
            const lastMessageDate = lastMessage ? convertToMoment(lastMessage.timeSent) : undefined;

            return { email: userEmail, lastMessageDate };
          })
        }),
        mergeMap(userEmailLastMsgList => {
          console.log("seconds/third concatMap");
          return combineLatest(of(userEmailLastMsgList), this.userService.getUsers());
        }),
        map(values => {
          const userEmailLastMsgList = values[0];
          const users = values[1];

          return userEmailLastMsgList.map(userEmailLastMsg => {
            var user = users.filter(u => u.email == userEmailLastMsg.email).pop()

            return {
              name: `${user.firstName} ${user.lastName}`,
              lastMessageElapsedTimeMs: moment(new Date()).diff(userEmailLastMsg.lastMessageDate)
            }
          })
            .sort((a, b) => {
              if (a.lastMessageElapsedTimeMs == 0)
                return 1;

              if (b.lastMessageElapsedTimeMs == 0)
                return -1;

              return a.lastMessageElapsedTimeMs - b.lastMessageElapsedTimeMs;
            });
        }),
        map(userNameLastMsgList => {
          return userNameLastMsgList.map(item => {
            const lastMessageElapsedTime = item.lastMessageElapsedTimeMs != 0 ?
              millisecondsToElapsedTime(item.lastMessageElapsedTimeMs) :
              "ainda não mandou mensagem";

            return {
              name: item.name,
              lastMessageElapsedTime
            }
          })
        }) 
      )
  }

  private privateChannelUsersEvaluation(observable: Observable<{ groupedMessages: Map<string, Message[]>, channel: Channel }>) {
    return observable.pipe(
      map(values => {
        const channel = values.channel;
        const groupedMessages = values.groupedMessages;

        var channelUsers = [...channel.guests || []];
        if (channel.owner)
          channelUsers.push(channel.owner);

        return { userEmails: channelUsers, groupedMessages };
      }))
  }

  private publicChannelUsersEvaluation(observable: Observable<{ groupedMessages: Map<string, Message[]>, channel: Channel }>) {
    return observable.pipe(
      mergeMap(values => {
        return combineLatest(of(values), this.userService.getUsers());
      }),
      map(values => {
        const users = values[1];
        const groupedMessages = values[0].groupedMessages;

        return { userEmails: users.map(u => u.email), groupedMessages };
      }))
  }

  updateCurrentChannel(channel: Channel) {
    this._currentChannel.next(channel);
  }

  updatePage($event: PageEvent) {
    this.currentPage = $event.pageIndex;
  }
}

function integerDivision(y: number, x: number): number {
  return Math.floor(y / x);
}

function millisecondsToElapsedTime(ms: number) {
  const minuteInMs = 60000;
  const hourInMs = minuteInMs * 60;
  const dayInMs = hourInMs * 24;
  const weekInMs = dayInMs * 7;

  const elapsedWeeks = integerDivision(ms, weekInMs);

  if (elapsedWeeks > 0)
    return `Última mensagem enviada há ${elapsedWeeks} semanas atrás`;

  const elapsedDays = integerDivision(ms, dayInMs);

  if (elapsedDays > 0)
    return `Última mensagem enviada há ${elapsedDays} dias atrás`;

  const elapsedHours = integerDivision(ms, hourInMs);

  if (elapsedHours > 0)
    return `Última mensagem enviada há ${elapsedHours} horas atrás`;

  const elapsedMinutes = integerDivision(ms, minuteInMs);

  return `Última mensagem enviada há ${elapsedMinutes} minutos atrás`;
}
