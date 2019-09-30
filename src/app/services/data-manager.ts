import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class DataManager {
    public station: any = false;
    public userId = '';
    public users = [];
    public user;
    public isApp = false;

    public ep = 'http://127.0.0.1:3030';
    public soc = 'http://192.168.50.179:3030';

    private servererror;

    constructor(
        private alert: AlertController,
        private http: HttpClient,
        private router: Router
    ) { }

    save(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    load(key: string) {
        if (localStorage.getItem(key) != null) {
            return JSON.parse(localStorage.getItem(key));
        } else {
            return false;
        }
    }

    loadUser() {
      this.user = this.load('user-data');
      return this.user;
    }

    signOut() {
      this.user = false;
      this.save('user-data', false);
      this.router.navigate(['signup'], {replaceUrl: true});
    }

    async dataError(error, str = true) {
        const alert = await this.alert.create({
            header: 'Error',
            message: str ? JSON.stringify(error) : error,
            buttons: ['OK']
        });
        await alert.present();
    }

    serverError() {
        console.log(this.servererror);
        if (!this.servererror) {
            this.alert.create({
                header: 'Server Error',
                message: 'Unable to Connect to Server. Please Check Your Internet Connection',
                buttons: ['CLOSE']
            }).then((error) => {
                error.onDidDismiss().then(() => {
                    this.servererror = false;
                });
                this.servererror = error;
                error.present();
            });
        }
    }

    post(command, data, triggerError: boolean = true) {
        const headers = {
          headers: { 'content-type': 'application/json' }
        };
        return new Promise((resolve, reject) => {
          this.http.post((
            this.isApp ? this.soc : this.ep) + '/' + command,
            JSON.stringify(data),
            headers).toPromise().then((response: any) => {
            if (triggerError) {
              if (response.result === 'success') {
                resolve(response);
              } else {
                this.dataError(response);
              }
            } else {
              if (response.error) {
                this.dataError(response.error, false);
              }
              resolve(response);
            }
          }).catch((error) => {
            if (triggerError) { this.serverError(); }
          });
        });
    }
}
