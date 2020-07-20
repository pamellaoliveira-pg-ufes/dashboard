import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Channel } from '../models/channel';

@Injectable({providedIn: 'root'})
export class ChannelService {

    constructor(private db: AngularFireDatabase) { }

    getChannels() : Observable<Channel[]> {
        return this.db.list('channels')
            .valueChanges()
            .pipe(map(item => item as Channel[]))
    }
}