import { Component, OnInit } from '@angular/core';
import { UserService, isOnline } from 'src/app/core/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dash-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.scss']
})
export class OnlineUsersComponent implements OnInit {

  onlineUsersCount$ = this.userService.getUsers()
    .pipe(map(users => users.filter(isOnline)),
      map(users => users.length))

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

}
