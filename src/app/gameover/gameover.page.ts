import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.page.html',
  styleUrls: ['./gameover.page.scss'],
})
export class GameoverPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  routeRanking() {
    this.router.navigate(['ranking'])
  }

}
