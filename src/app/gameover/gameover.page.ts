import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DataService } from '../data.service';
import { StorageService } from '../storage.service';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.page.html',
  styleUrls: ['./gameover.page.scss'],
})
export class GameoverPage implements OnInit {

  constructor(private router: Router, private platform: Platform, private dataService: DataService, private storageService: StorageService, private device: Device) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['home'])
    });

    this.storageService.getData().subscribe(res => {
      var score = res.score;
      var name = res.name;
      console.log(name);
      
      this.dataService.getDailyById("fq4PWpFAW6JOsBZlKlJR").subscribe(response => {
        var dailyScore = response.score;
        if(score > dailyScore) {
          this.dataService.createDaily({ id: "this.device.uuid", name: name, score: score })
        }
      })

      this.dataService.getWeeklyById("h00A513alcGrZDleubOE").subscribe(response => {
        var weeklyScore = response.score;
        if(score > weeklyScore) {
          this.dataService.createWeekly({ id: "this.device.uuid", name: name, score: score })
        }
      })
    })
  }

  ngOnInit() {
  }

  routeRanking() {
    this.router.navigate(['ranking'])
  }

}
