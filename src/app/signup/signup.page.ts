import { Component } from '@angular/core';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { DataManager } from 'src/app/services/data-manager';
import { Router } from '@angular/router';

@Component({
    selector: 'signup-page',
    templateUrl: 'signup.page.html',
    styleUrls: ['signup.page.scss']
})
export class SignupPage {
    time = { last: 0, now: 0, delta: 0 };
    angle = 0;
    targetAngle = 0;
    frame = 0;
    options: GyroscopeOptions = { frequency: 33 };
    axeVideo: HTMLVideoElement;
    videoLoaded = false;

    formselect = false;

    signin = {
        email: '',
        pass: ''
    };

    signup = {
        first_name: '',
        last_name: '',
        email: '',
        pass: '',
        repass: ''
    };

    constructor(
        private gyroscope: Gyroscope,
        private dataMngr: DataManager,
        private router: Router
    ) {
        if (this.dataMngr.isApp) {
            this.gyroscope.watch(this.options)
            .subscribe((orientation: GyroscopeOrientation) => {
                // calc new angle frame
                this.time.now = new Date().getTime();
                this.time.delta = this.time.now - this.time.last;
                if (this.videoLoaded) {
                    const degree = 180 / Math.PI * orientation.z;
                    this.targetAngle -= (this.time.delta / 1000) * degree;
                    this.angle = (1 - .1) * this.angle + .1 * this.targetAngle;

                    let displayAngle = this.angle % 360;
                    if (displayAngle < 0) { displayAngle = 360 + displayAngle; }
                    // debug
                    this.frame = Math.round((displayAngle * this.axeVideo.duration / 360) * 100) / 100;
                    // end debug
                    this.axeVideo.currentTime = this.frame;
                } else {
                    this.angle = this.targetAngle = 0;
                }
                this.time.last = this.time.now;
            });
        }
    }

    ionViewDidEnter() {
        this.axeVideo = document.querySelector('video.axe-video');
        this.axeVideo.oncanplay = () => {
            if (!this.videoLoaded) {
                this.videoLoaded = true;
            }
        }
        console.dir(this.axeVideo);
    }

    onFrame() {
        this.axeVideo.currentTime = this.angle * this.axeVideo.duration / 360;
    }

    onSignup() {
        if (this.signup.pass === this.signup.repass) {
            this.dataMngr.post('signup', this.signup, false).then((data: any) => {
                if (data.auth) {
                    this.login(data.user);
                }
            });
        } else {
            this.dataMngr.dataError('Passwords do not match, please double check!', false);
        }
    }

    onSignin() {
        this.dataMngr.post('signin', this.signin, false).then((data: any) => {
            if (data.auth) {
                this.login(data.user);
            }
        });
    }

    login(user) {
        this.dataMngr.save('user-data', user);
        this.dataMngr.loadUser();
        this.router.navigate(['home'], {replaceUrl: true});
    }

}
