import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocketIO } from './services/socket.provider';
import { DataManager } from './services/data-manager';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socket: SocketIO,
    private alert: AlertController,
    private dataMngr: DataManager,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.dataMngr.isApp = true;
        console.log('isApp');
      } else { console.log('notApp'); }
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.dataMngr.loadUser();

      // socket
      this.socket.init();
      this.socket.io.on('app-error', (data) => {
        this.alert.create({
          header: data.header,
          subHeader: data.subHeader,
          buttons: ['Ok']
        }).then((a) => {
          a.present();
        });
      });
      this.socket.io.on('server-reset', () => {
        console.log('reset-login');
        this.dataMngr.station = false;
        this.router.navigate(['home']);
      });
      this.socket.io.on('user-update', (data: UserUpdate) => {
        if (data.action === 'join') {
          this.dataMngr.station = data.station;
          if (this.socket.io.id === data.id) {
            this.dataMngr.userId = data.id;
          }
          this.dataMngr.users.push(data.id);
        }
        if (data.action === 'leave') {
          console.log('leave', data.id, this.dataMngr.userId);
          if (data.id === this.dataMngr.userId) {
            this.dataMngr.station = false;
          }
        }
      });
      // socket end

    });
  }
}

export interface UserUpdate {
  action: 'join' | 'leave';
  station: string;
  id: string;
}
