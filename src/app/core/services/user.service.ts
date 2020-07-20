import { Injectable } from "@angular/core";

import { AngularFireDatabase } from "@angular/fire/database";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { User } from "../models/user";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private db: AngularFireDatabase) { }

    getUsers(): Observable<User[]> {
        return this.db.list('users')
            .valueChanges()
            .pipe(map(item => item as User[]))
    }
}

export function isOnline(user: User) {
    return user.status == 'online';
}

export function isOffline(user: User) {
    return user.status == 'offline';
}