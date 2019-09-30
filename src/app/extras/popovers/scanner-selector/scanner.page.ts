import { Component } from '@angular/core';
import { PopoverController, ModalController, AlertController } from '@ionic/angular';
import { DataManager } from 'src/app/services/data-manager';
import { AlertButton, AlertInput } from '@ionic/core';
import { SocketIO } from 'src/app/services/socket.provider';


@Component({
    selector: 'scanner-selector',
    templateUrl: 'scanner.page.html',
    styleUrls: ['scanner.page.scss']
})
export class JoinStationComponent {
    io;

    constructor(
        private dataMngr: DataManager,
        private pop: PopoverController,
        private alert: AlertController,
        private socket: SocketIO
        ) {
            this.io = socket.io;
        }

    onOpenScanner() {
        // open qr scanner
        this.onHidePopover();
    }

    async onStationId() {
        const alert = await this.alert.create({
            header: 'Join Station',
            subHeader: 'Enter four digit station ID',
            inputs: [{type: 'text', placeholder: 'Station ID', id: 'station_id'} as AlertInput],
            buttons: [{text: 'Join', handler: (data) => {
                this.io.emit('user-join', {station: data[0].toUpperCase(), user: this.dataMngr.user});
            }} as AlertButton]
        });
        alert.present();
        this.onHidePopover();
    }

    onHidePopover() {
        this.pop.dismiss();
    }
}
