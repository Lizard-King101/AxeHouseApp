import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'game-page',
    templateUrl: 'game.page.html',
    styleUrls: ['game.page.scss']
})
export class GamePage {
    game;
    constructor(private route: ActivatedRoute) {
        this.game = this.route.snapshot.paramMap.get('id');
    }
}
