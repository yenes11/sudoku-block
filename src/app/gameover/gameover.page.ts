import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.page.html',
  styleUrls: ['./gameover.page.scss'],
})
export class GameoverPage implements OnInit {

  constructor(private router: Router, private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['home'])
    });
  }

  ngOnInit() {
  }

  routeRanking() {
    this.router.navigate(['ranking'])
  }

}
