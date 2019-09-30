import { Component } from '@angular/core';
import { SocketIO } from '../services/socket.provider';
import { AlertController, PopoverController } from '@ionic/angular';
import { AlertButton, AlertInput } from '@ionic/core';
import { DataManager } from '../services/data-manager';
import { JoinStationComponent } from '../extras/popovers/scanner-selector/scanner.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  io;
  constructor(
    private socket: SocketIO,
    private dataMngr: DataManager,
    private alert: AlertController,
    private popover: PopoverController) {
    this.io = this.socket.io;
  }

  async onStation(e) {
    let alert;
    if (this.dataMngr.station) {
      alert = await this.alert.create({
        header: 'Leave current station?',
        buttons: ['No', {text: 'Yes', handler: () => {
          this.io.emit('user-leave');
        }} as AlertButton]
      });
    } else {
      alert = await this.popover.create({
        component: JoinStationComponent,
        event: e
      });
    }
    alert.present();
  }

  onAccount() {
    // go to account page
    this.dataMngr.signOut();
    this.io.emit('user-leave');
  }

}
