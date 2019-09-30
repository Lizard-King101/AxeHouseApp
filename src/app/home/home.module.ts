import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { JoinStationComponent } from '../extras/popovers/scanner-selector/scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage,
        children: [
          {
            path: 'game/:id',
            loadChildren: './game/game.module#GamePageModule'
          },
          {
            path: 'games',
            loadChildren: './games/games.module#GamesPageModule'
          },
          {
            path: 'game',
            redirectTo: 'games',
            pathMatch: 'full'
          },
          {
            path: '',
            redirectTo: 'games',
            pathMatch: 'full'
          }
        ]
      }
    ])
  ],
  declarations: [
    HomePage,
    JoinStationComponent
  ],
  entryComponents: [
    JoinStationComponent
  ]
})
export class HomePageModule {}
