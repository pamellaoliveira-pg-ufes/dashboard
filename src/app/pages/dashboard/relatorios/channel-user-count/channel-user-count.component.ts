import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { ChannelService } from 'src/app/core/services/channel.service';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'dash-channel-user-count',
  templateUrl: './channel-user-count.component.html',
  styleUrls: ['./channel-user-count.component.scss']
})
export class ChannelUserCountComponent implements OnInit {

  private _unsubscribeAll = new Subject();

  isDataAvailable:boolean = false;
  
  public pieChartLabels: Label[];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  private $channelsUserCount = this.channelService
    .getChannels()
    .pipe(
      map(channels => channels.filter(c => c.type == "private")),
      map(channels => {
        return channels
          .map(c => {
            return { name: c.title, userCount: c.guests?.length }
          })
      }),
      tap(_ => this.isDataAvailable = true)
    )
  
  constructor(private channelService: ChannelService) { }

  ngOnInit(): void {
    this.$channelsUserCount
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(channelsUserCount => {
        this.pieChartLabels = channelsUserCount.map(c => c.name as Label);
        this.pieChartData = channelsUserCount.map(c => c.userCount);
      })
  }

}
