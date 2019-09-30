import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DataManager } from './data-manager';

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(private dataMngr: DataManager, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
        const requiresLogin = route.data.requiresLogin || false;
        const skipLogin = route.data.skipLogin || false;
        const user = this.dataMngr.loadUser();
        if (requiresLogin) {
            if (user) {
                return true;
            } else {
                this.router.navigate(['signup'], {replaceUrl: true});
                return false;
            }
        }

        if (skipLogin) {
            if (user) {
                this.router.navigate(['home'], {replaceUrl: true});
                return false;
            } else {
                return true;
            }
        }
    }
}