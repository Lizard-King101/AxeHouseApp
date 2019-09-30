import { Injectable } from '@angular/core';
import { DataManager } from './data-manager';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';
declare var io;

@Injectable()
export class SocketIO {
    public io;
    private connErr = true;

    constructor(
        private dataMngr: DataManager,
        private toast: ToastController
    ) { }

    init() {
        this.io = io(this.dataMngr.isApp ? this.dataMngr.soc : this.dataMngr.ep);
        this.io.on('connect', () => { this.connect(); });
        this.io.on('disconnect', () => { this.connect(true); });
        this.io.on('connect_error', () => { this.connectError(); });
    }

    connectError() {
        if (this.connErr) {
            this.toast.create({
                message: 'Error connecting to server',
                duration: 2000,
                animated: true,
                showCloseButton: true,
                closeButtonText: 'OK',
                cssClass: 'my-toast-error',
                position: 'bottom'
            } as ToastOptions).then((toast) => {
                toast.present();
                this.connErr = false;
            });
        }
    }

    connect(dis = false) {
        this.toast.create({
            message: dis ? 'Disconnected' : 'Connected' ,
            duration: 1000,
            animated: true,
            cssClass: 'my-toast-success',
            position: 'bottom'
        } as ToastOptions).then((toast) => {
            if (!dis) {this.connErr = true; }
            toast.present();
        });
    }
}
