import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';

import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersMessagesPerChannelComponent } from './pages/dashboard/relatorios/users-messages-per-channel/users-messages-per-channel.component';
import { LastSendedMessageElapsedTimeComponent } from './pages/dashboard/relatorios/last-sended-message-elapsed-time/last-sended-message-elapsed-time.component';
import { SharedModule } from "./shared/shared.module";
import { environment } from '../environments/environment';
import { MostTaggedUsersComponent } from './pages/dashboard/relatorios/most-tagged-users/most-tagged-users.component';
import { MessagesInLastThirtyDaysComponent } from './pages/dashboard/relatorios/messages-in-last-thirty-days/messages-in-last-thirty-days.component';
import { OnlineUsersComponent } from './pages/dashboard/relatorios/online-users/online-users.component';
import { OfflineUsersComponent } from './pages/dashboard/relatorios/offline-users/offline-users.component';
import { MessagesInLastThirtyDaysCountComponent } from './pages/dashboard/relatorios/messages-in-last-thirty-days-count/messages-in-last-thirty-days-count.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UsersMessagesPerChannelComponent,
    LastSendedMessageElapsedTimeComponent,
    MostTaggedUsersComponent,
    MessagesInLastThirtyDaysComponent,
    OnlineUsersComponent,
    OfflineUsersComponent,
    MessagesInLastThirtyDaysCountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    SharedModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
