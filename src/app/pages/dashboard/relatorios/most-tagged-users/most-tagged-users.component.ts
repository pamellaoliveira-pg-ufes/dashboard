import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/core/services/message.service';
import { UserService } from 'src/app/core/services/user.service';
import { map, concatMap, tap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { ChartDataSets, ChartOptions, ChartYAxe, ChartXAxe } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'dash-most-tagged-users',
  templateUrl: './most-tagged-users.component.html',
  styleUrls: ['./most-tagged-users.component.scss']
})
export class MostTaggedUsersComponent implements OnInit {

  isReady = false;

  data: ChartDataSets[];
  xAx: ChartYAxe[]= [];

  mostTaggedUsers$ = this.messageService.getMessage()
    .pipe(
      map(messages => messages.filter(msg => msg.taggedUsers?.length > 0)),
      concatMap(messages => combineLatest(of(messages), this.userService.getUsers())),
      map(values => {
        const messages = values[0];
        const users = values[1];

        const taggedCount: { user: User, tagCount: number }[] = [];

        messages
          .map(m => m.taggedUsers)
          .map(flattenArr)
          .forEach(taggedUserEmail => {
            const registry = taggedCount.filter(tc => tc.user.email == taggedUserEmail).pop();

            if (taggedCount.length >= 10)
              return;

            if (registry)
              registry.tagCount++;
            else {
              const user = users.filter(u => u.email == taggedUserEmail).pop();
              taggedCount.push({ user, tagCount: 1 })
            }
          });

        return taggedCount;
      }),
      tap(_ => this.isReady = true))

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
    private userService: UserService) { }

  ngOnInit(): void {
    this.mostTaggedUsers$
      .subscribe(items => {
        this.data = items
          .map(item => { return { label: `${item.user?.firstName} ${item.user?.lastName}`, data: [item.tagCount] } });

        const biggest = items
          .sort((a, b) => a.tagCount - b.tagCount)
          .pop();

        this.xAx = split(biggest.tagCount, 5)
          .map(x => x as ChartXAxe);

        console.log(this.xAx);
        console.log(this.data);
      });
  }

}

function flattenArr(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flattenArr(toFlatten) : toFlatten);
  }, []);
}

function split(number: number, sections: number) {
  var num = Math.ceil(number / sections);

  return [...Array(sections).keys()]
    .reduce((arr, n) => [...arr, n * num], []);
}