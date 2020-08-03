import { Injectable } from "@angular/core";

import { AngularFireDatabase } from "@angular/fire/database";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import * as moment from 'moment';

import { Message } from "../models/message";

@Injectable({ providedIn: 'root' })
export class MessageService {

    constructor(private db: AngularFireDatabase) { }

    getMessage(): Observable<Message[]> {
        return this.db.list('messages')
            .valueChanges()
            .pipe(map(item => item as Message[]))
    }
}

export function filterByChannelId(messages: Message[], channelId: string) {
    return messages?.filter(m => m.channel == channelId)
}

export function filterByDate(msg:Message, startDate: moment.Moment, endDate: moment.Moment) {
    const msgDate = convertToMoment(msg.timeSent);
    return startDate <= msgDate && endDate >= msgDate;
}

export function groupByUsers(messages: Message[]): Map<string, Message[]> {
    return messages?.reduce((entryMap, msg) =>
        entryMap.set(msg.email, [...entryMap.get(msg.email) || [], msg]), new Map())
}

export function groupByDate(messages: Message[]): Map<number, Message[]> {
    return messages?.reduce((entryMap, msg) => {
        const msgDate = convertToMoment(msg.timeSent).startOf('day').unix();
        return entryMap.set(msgDate, [...entryMap.get(msgDate) || [], msg])}, new Map())
}

export function compareByDate(msgA: Message, msgB: Message) {
    const dateA = convertToMoment(msgA.timeSent);
    const dateB = convertToMoment(msgB.timeSent);

    if (dateA > dateB)
        return 1;
    else if (dateB > dateA)
        return -1;

    return 0
}

export function getLatestMessage(messages: Message[]) {
    return messages?.reduce((latest, current) =>
        compareByDate(current, latest) > 0 ? current : latest)
}

export function convertToMoment(date: string, format: string = "DD.MM.YYYY HH:mm") {
    return moment(date, format)
}