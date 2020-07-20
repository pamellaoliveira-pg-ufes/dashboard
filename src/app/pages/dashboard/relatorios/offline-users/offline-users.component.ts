import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { isOffline, UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'dash-offline-users',
  templateUrl: './offline-users.component.html',
  styleUrls: ['./offline-users.component.scss']
})
export class OfflineUsersComponent implements OnInit {

  offlineUsersCount$ = this.userService.getUsers()
    .pipe(map(users => users.filter(isOffline)),
      map(users => users.length))

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

}
