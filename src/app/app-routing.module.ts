import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AccessGuard } from './services/accessgaurd.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  },
  {
    path: 'signup',
    loadChildren: './signup/signup.module#SignupPageModule',
    data: { skipLogin: true },
    canActivate: [AccessGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
